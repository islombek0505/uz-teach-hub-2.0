import path__default from "path";
import { r as requireGracefulFs } from "./graceful-fs.mjs";
import { r as requireRetry } from "./retry.mjs";
import { r as requireSignalExit } from "./signal-exit.mjs";
var properLockfile = { exports: {} };
var lockfile = {};
var mtimePrecision = {};
var hasRequiredMtimePrecision;
function requireMtimePrecision() {
  if (hasRequiredMtimePrecision) return mtimePrecision;
  hasRequiredMtimePrecision = 1;
  const cacheSymbol = /* @__PURE__ */ Symbol();
  function probe(file, fs, callback) {
    const cachedPrecision = fs[cacheSymbol];
    if (cachedPrecision) {
      return fs.stat(file, (err, stat) => {
        if (err) {
          return callback(err);
        }
        callback(null, stat.mtime, cachedPrecision);
      });
    }
    const mtime = new Date(Math.ceil(Date.now() / 1e3) * 1e3 + 5);
    fs.utimes(file, mtime, mtime, (err) => {
      if (err) {
        return callback(err);
      }
      fs.stat(file, (err2, stat) => {
        if (err2) {
          return callback(err2);
        }
        const precision = stat.mtime.getTime() % 1e3 === 0 ? "s" : "ms";
        Object.defineProperty(fs, cacheSymbol, { value: precision });
        callback(null, stat.mtime, precision);
      });
    });
  }
  function getMtime(precision) {
    let now = Date.now();
    if (precision === "s") {
      now = Math.ceil(now / 1e3) * 1e3;
    }
    return new Date(now);
  }
  mtimePrecision.probe = probe;
  mtimePrecision.getMtime = getMtime;
  return mtimePrecision;
}
var hasRequiredLockfile;
function requireLockfile() {
  if (hasRequiredLockfile) return lockfile;
  hasRequiredLockfile = 1;
  const path = path__default;
  const fs = requireGracefulFs();
  const retry = requireRetry();
  const onExit = requireSignalExit();
  const mtimePrecision2 = requireMtimePrecision();
  const locks = {};
  function getLockFile(file, options) {
    return options.lockfilePath || `${file}.lock`;
  }
  function resolveCanonicalPath(file, options, callback) {
    if (!options.realpath) {
      return callback(null, path.resolve(file));
    }
    options.fs.realpath(file, callback);
  }
  function acquireLock(file, options, callback) {
    const lockfilePath = getLockFile(file, options);
    options.fs.mkdir(lockfilePath, (err) => {
      if (!err) {
        return mtimePrecision2.probe(lockfilePath, options.fs, (err2, mtime, mtimePrecision3) => {
          if (err2) {
            options.fs.rmdir(lockfilePath, () => {
            });
            return callback(err2);
          }
          callback(null, mtime, mtimePrecision3);
        });
      }
      if (err.code !== "EEXIST") {
        return callback(err);
      }
      if (options.stale <= 0) {
        return callback(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file }));
      }
      options.fs.stat(lockfilePath, (err2, stat) => {
        if (err2) {
          if (err2.code === "ENOENT") {
            return acquireLock(file, { ...options, stale: 0 }, callback);
          }
          return callback(err2);
        }
        if (!isLockStale(stat, options)) {
          return callback(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file }));
        }
        removeLock(file, options, (err3) => {
          if (err3) {
            return callback(err3);
          }
          acquireLock(file, { ...options, stale: 0 }, callback);
        });
      });
    });
  }
  function isLockStale(stat, options) {
    return stat.mtime.getTime() < Date.now() - options.stale;
  }
  function removeLock(file, options, callback) {
    options.fs.rmdir(getLockFile(file, options), (err) => {
      if (err && err.code !== "ENOENT") {
        return callback(err);
      }
      callback();
    });
  }
  function updateLock(file, options) {
    const lock2 = locks[file];
    if (lock2.updateTimeout) {
      return;
    }
    lock2.updateDelay = lock2.updateDelay || options.update;
    lock2.updateTimeout = setTimeout(() => {
      lock2.updateTimeout = null;
      options.fs.stat(lock2.lockfilePath, (err, stat) => {
        const isOverThreshold = lock2.lastUpdate + options.stale < Date.now();
        if (err) {
          if (err.code === "ENOENT" || isOverThreshold) {
            return setLockAsCompromised(file, lock2, Object.assign(err, { code: "ECOMPROMISED" }));
          }
          lock2.updateDelay = 1e3;
          return updateLock(file, options);
        }
        const isMtimeOurs = lock2.mtime.getTime() === stat.mtime.getTime();
        if (!isMtimeOurs) {
          return setLockAsCompromised(
            file,
            lock2,
            Object.assign(
              new Error("Unable to update lock within the stale threshold"),
              { code: "ECOMPROMISED" }
            )
          );
        }
        const mtime = mtimePrecision2.getMtime(lock2.mtimePrecision);
        options.fs.utimes(lock2.lockfilePath, mtime, mtime, (err2) => {
          const isOverThreshold2 = lock2.lastUpdate + options.stale < Date.now();
          if (lock2.released) {
            return;
          }
          if (err2) {
            if (err2.code === "ENOENT" || isOverThreshold2) {
              return setLockAsCompromised(file, lock2, Object.assign(err2, { code: "ECOMPROMISED" }));
            }
            lock2.updateDelay = 1e3;
            return updateLock(file, options);
          }
          lock2.mtime = mtime;
          lock2.lastUpdate = Date.now();
          lock2.updateDelay = null;
          updateLock(file, options);
        });
      });
    }, lock2.updateDelay);
    if (lock2.updateTimeout.unref) {
      lock2.updateTimeout.unref();
    }
  }
  function setLockAsCompromised(file, lock2, err) {
    lock2.released = true;
    if (lock2.updateTimeout) {
      clearTimeout(lock2.updateTimeout);
    }
    if (locks[file] === lock2) {
      delete locks[file];
    }
    lock2.options.onCompromised(err);
  }
  function lock(file, options, callback) {
    options = {
      stale: 1e4,
      update: null,
      realpath: true,
      retries: 0,
      fs,
      onCompromised: (err) => {
        throw err;
      },
      ...options
    };
    options.retries = options.retries || 0;
    options.retries = typeof options.retries === "number" ? { retries: options.retries } : options.retries;
    options.stale = Math.max(options.stale || 0, 2e3);
    options.update = options.update == null ? options.stale / 2 : options.update || 0;
    options.update = Math.max(Math.min(options.update, options.stale / 2), 1e3);
    resolveCanonicalPath(file, options, (err, file2) => {
      if (err) {
        return callback(err);
      }
      const operation = retry.operation(options.retries);
      operation.attempt(() => {
        acquireLock(file2, options, (err2, mtime, mtimePrecision3) => {
          if (operation.retry(err2)) {
            return;
          }
          if (err2) {
            return callback(operation.mainError());
          }
          const lock2 = locks[file2] = {
            lockfilePath: getLockFile(file2, options),
            mtime,
            mtimePrecision: mtimePrecision3,
            options,
            lastUpdate: Date.now()
          };
          updateLock(file2, options);
          callback(null, (releasedCallback) => {
            if (lock2.released) {
              return releasedCallback && releasedCallback(Object.assign(new Error("Lock is already released"), { code: "ERELEASED" }));
            }
            unlock(file2, { ...options, realpath: false }, releasedCallback);
          });
        });
      });
    });
  }
  function unlock(file, options, callback) {
    options = {
      fs,
      realpath: true,
      ...options
    };
    resolveCanonicalPath(file, options, (err, file2) => {
      if (err) {
        return callback(err);
      }
      const lock2 = locks[file2];
      if (!lock2) {
        return callback(Object.assign(new Error("Lock is not acquired/owned by you"), { code: "ENOTACQUIRED" }));
      }
      lock2.updateTimeout && clearTimeout(lock2.updateTimeout);
      lock2.released = true;
      delete locks[file2];
      removeLock(file2, options, callback);
    });
  }
  function check(file, options, callback) {
    options = {
      stale: 1e4,
      realpath: true,
      fs,
      ...options
    };
    options.stale = Math.max(options.stale || 0, 2e3);
    resolveCanonicalPath(file, options, (err, file2) => {
      if (err) {
        return callback(err);
      }
      options.fs.stat(getLockFile(file2, options), (err2, stat) => {
        if (err2) {
          return err2.code === "ENOENT" ? callback(null, false) : callback(err2);
        }
        return callback(null, !isLockStale(stat, options));
      });
    });
  }
  function getLocks() {
    return locks;
  }
  onExit(() => {
    for (const file in locks) {
      const options = locks[file].options;
      try {
        options.fs.rmdirSync(getLockFile(file, options));
      } catch (e) {
      }
    }
  });
  lockfile.lock = lock;
  lockfile.unlock = unlock;
  lockfile.check = check;
  lockfile.getLocks = getLocks;
  return lockfile;
}
var adapter;
var hasRequiredAdapter;
function requireAdapter() {
  if (hasRequiredAdapter) return adapter;
  hasRequiredAdapter = 1;
  const fs = requireGracefulFs();
  function createSyncFs(fs2) {
    const methods = ["mkdir", "realpath", "stat", "rmdir", "utimes"];
    const newFs = { ...fs2 };
    methods.forEach((method) => {
      newFs[method] = (...args) => {
        const callback = args.pop();
        let ret;
        try {
          ret = fs2[`${method}Sync`](...args);
        } catch (err) {
          return callback(err);
        }
        callback(null, ret);
      };
    });
    return newFs;
  }
  function toPromise(method) {
    return (...args) => new Promise((resolve, reject) => {
      args.push((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      method(...args);
    });
  }
  function toSync(method) {
    return (...args) => {
      let err;
      let result;
      args.push((_err, _result) => {
        err = _err;
        result = _result;
      });
      method(...args);
      if (err) {
        throw err;
      }
      return result;
    };
  }
  function toSyncOptions(options) {
    options = { ...options };
    options.fs = createSyncFs(options.fs || fs);
    if (typeof options.retries === "number" && options.retries > 0 || options.retries && typeof options.retries.retries === "number" && options.retries.retries > 0) {
      throw Object.assign(new Error("Cannot use retries with the sync api"), { code: "ESYNC" });
    }
    return options;
  }
  adapter = {
    toPromise,
    toSync,
    toSyncOptions
  };
  return adapter;
}
var hasRequiredProperLockfile;
function requireProperLockfile() {
  if (hasRequiredProperLockfile) return properLockfile.exports;
  hasRequiredProperLockfile = 1;
  const lockfile2 = requireLockfile();
  const { toPromise, toSync, toSyncOptions } = requireAdapter();
  async function lock(file, options) {
    const release = await toPromise(lockfile2.lock)(file, options);
    return toPromise(release);
  }
  function lockSync(file, options) {
    const release = toSync(lockfile2.lock)(file, toSyncOptions(options));
    return toSync(release);
  }
  function unlock(file, options) {
    return toPromise(lockfile2.unlock)(file, options);
  }
  function unlockSync(file, options) {
    return toSync(lockfile2.unlock)(file, toSyncOptions(options));
  }
  function check(file, options) {
    return toPromise(lockfile2.check)(file, options);
  }
  function checkSync(file, options) {
    return toSync(lockfile2.check)(file, toSyncOptions(options));
  }
  properLockfile.exports = lock;
  properLockfile.exports.lock = lock;
  properLockfile.exports.unlock = unlock;
  properLockfile.exports.lockSync = lockSync;
  properLockfile.exports.unlockSync = unlockSync;
  properLockfile.exports.check = check;
  properLockfile.exports.checkSync = checkSync;
  return properLockfile.exports;
}
var properLockfileExports = requireProperLockfile();
export {
  properLockfileExports as p
};

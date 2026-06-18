import require$$2 from "events";
import { c as commonjsGlobal } from "./react.mjs";
import require$$5 from "assert";
var signalExit = { exports: {} };
var signals = { exports: {} };
var hasRequiredSignals;
function requireSignals() {
  if (hasRequiredSignals) return signals.exports;
  hasRequiredSignals = 1;
  (function(module) {
    module.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  })(signals);
  return signals.exports;
}
var hasRequiredSignalExit;
function requireSignalExit() {
  if (hasRequiredSignalExit) return signalExit.exports;
  hasRequiredSignalExit = 1;
  var process2 = commonjsGlobal.process;
  const processOk = function(process3) {
    return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
  };
  if (!processOk(process2)) {
    signalExit.exports = function() {
      return function() {
      };
    };
  } else {
    var assert = require$$5;
    var signals2 = requireSignals();
    var isWin = /^win/i.test(process2.platform);
    var EE = require$$2;
    if (typeof EE !== "function") {
      EE = EE.EventEmitter;
    }
    var emitter;
    if (process2.__signal_exit_emitter__) {
      emitter = process2.__signal_exit_emitter__;
    } else {
      emitter = process2.__signal_exit_emitter__ = new EE();
      emitter.count = 0;
      emitter.emitted = {};
    }
    if (!emitter.infinite) {
      emitter.setMaxListeners(Infinity);
      emitter.infinite = true;
    }
    signalExit.exports = function(cb, opts) {
      if (!processOk(commonjsGlobal.process)) {
        return function() {
        };
      }
      assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
      if (loaded === false) {
        load();
      }
      var ev = "exit";
      if (opts && opts.alwaysLast) {
        ev = "afterexit";
      }
      var remove = function() {
        emitter.removeListener(ev, cb);
        if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
          unload();
        }
      };
      emitter.on(ev, cb);
      return remove;
    };
    var unload = function unload2() {
      if (!loaded || !processOk(commonjsGlobal.process)) {
        return;
      }
      loaded = false;
      signals2.forEach(function(sig) {
        try {
          process2.removeListener(sig, sigListeners[sig]);
        } catch (er) {
        }
      });
      process2.emit = originalProcessEmit;
      process2.reallyExit = originalProcessReallyExit;
      emitter.count -= 1;
    };
    signalExit.exports.unload = unload;
    var emit = function emit2(event, code, signal) {
      if (emitter.emitted[event]) {
        return;
      }
      emitter.emitted[event] = true;
      emitter.emit(event, code, signal);
    };
    var sigListeners = {};
    signals2.forEach(function(sig) {
      sigListeners[sig] = function listener() {
        if (!processOk(commonjsGlobal.process)) {
          return;
        }
        var listeners = process2.listeners(sig);
        if (listeners.length === emitter.count) {
          unload();
          emit("exit", null, sig);
          emit("afterexit", null, sig);
          if (isWin && sig === "SIGHUP") {
            sig = "SIGINT";
          }
          process2.kill(process2.pid, sig);
        }
      };
    });
    signalExit.exports.signals = function() {
      return signals2;
    };
    var loaded = false;
    var load = function load2() {
      if (loaded || !processOk(commonjsGlobal.process)) {
        return;
      }
      loaded = true;
      emitter.count += 1;
      signals2 = signals2.filter(function(sig) {
        try {
          process2.on(sig, sigListeners[sig]);
          return true;
        } catch (er) {
          return false;
        }
      });
      process2.emit = processEmit;
      process2.reallyExit = processReallyExit;
    };
    signalExit.exports.load = load;
    var originalProcessReallyExit = process2.reallyExit;
    var processReallyExit = function processReallyExit2(code) {
      if (!processOk(commonjsGlobal.process)) {
        return;
      }
      process2.exitCode = code || /* istanbul ignore next */
      0;
      emit("exit", process2.exitCode, null);
      emit("afterexit", process2.exitCode, null);
      originalProcessReallyExit.call(process2, process2.exitCode);
    };
    var originalProcessEmit = process2.emit;
    var processEmit = function processEmit2(ev, arg) {
      if (ev === "exit" && processOk(commonjsGlobal.process)) {
        if (arg !== void 0) {
          process2.exitCode = arg;
        }
        var ret = originalProcessEmit.apply(this, arguments);
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        return ret;
      } else {
        return originalProcessEmit.apply(this, arguments);
      }
    };
  }
  return signalExit.exports;
}
export {
  requireSignalExit as r
};

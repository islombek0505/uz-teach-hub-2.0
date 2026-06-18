import { c as commonjsGlobal } from "./react.mjs";
var lodash__createset$1 = { exports: {} };
var lodash__createset = lodash__createset$1.exports;
var hasRequiredLodash__createset;
function requireLodash__createset() {
  if (hasRequiredLodash__createset) return lodash__createset$1.exports;
  hasRequiredLodash__createset = 1;
  (function(module, exports) {
    var INFINITY = 1 / 0;
    var funcTag = "[object Function]", genTag = "[object GeneratorFunction]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var objectTypes = {
      "function": true,
      "object": true
    };
    var freeExports = exports && !exports.nodeType ? exports : void 0;
    var freeModule = module && !module.nodeType ? module : void 0;
    var freeGlobal = checkGlobal(freeExports && freeModule && typeof commonjsGlobal == "object" && commonjsGlobal);
    var freeSelf = checkGlobal(objectTypes[typeof self] && self);
    var freeWindow = checkGlobal(objectTypes[typeof window] && window);
    var thisGlobal = checkGlobal(objectTypes[typeof lodash__createset] && lodash__createset);
    var root = freeGlobal || freeWindow !== (thisGlobal && thisGlobal.window) && freeWindow || freeSelf || thisGlobal || Function("return this")();
    function checkGlobal(value) {
      return value && value.Object === Object ? value : null;
    }
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var objectProto = Object.prototype;
    var funcToString = Function.prototype.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Set = getNative(root, "Set");
    var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set(values);
    };
    function getNative(object, key) {
      var value = object[key];
      return isNative(value) ? value : void 0;
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isNative(value) {
      if (!isObject(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function noop() {
    }
    module.exports = createSet;
  })(lodash__createset$1, lodash__createset$1.exports);
  return lodash__createset$1.exports;
}
export {
  requireLodash__createset as r
};

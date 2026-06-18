import { c as commonjsGlobal } from "./react.mjs";
var lodash__basetostring$1 = { exports: {} };
var lodash__basetostring = lodash__basetostring$1.exports;
var hasRequiredLodash__basetostring;
function requireLodash__basetostring() {
  if (hasRequiredLodash__basetostring) return lodash__basetostring$1.exports;
  hasRequiredLodash__basetostring = 1;
  (function(module, exports) {
    var symbolTag = "[object Symbol]";
    var objectTypes = {
      "function": true,
      "object": true
    };
    var freeExports = exports && !exports.nodeType ? exports : void 0;
    var freeModule = module && !module.nodeType ? module : void 0;
    var freeGlobal = checkGlobal(freeExports && freeModule && typeof commonjsGlobal == "object" && commonjsGlobal);
    var freeSelf = checkGlobal(objectTypes[typeof self] && self);
    var freeWindow = checkGlobal(objectTypes[typeof window] && window);
    var thisGlobal = checkGlobal(objectTypes[typeof lodash__basetostring] && lodash__basetostring);
    var root = freeGlobal || freeWindow !== (thisGlobal && thisGlobal.window) && freeWindow || freeSelf || thisGlobal || Function("return this")();
    function checkGlobal(value) {
      return value && value.Object === Object ? value : null;
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol = root.Symbol;
    var symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -Infinity ? "-0" : result;
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    module.exports = baseToString;
  })(lodash__basetostring$1, lodash__basetostring$1.exports);
  return lodash__basetostring$1.exports;
}
export {
  requireLodash__basetostring as r
};

import { c as commonjsGlobal } from "./react.mjs";
var lodash__root$1 = { exports: {} };
var lodash__root = lodash__root$1.exports;
var hasRequiredLodash__root;
function requireLodash__root() {
  if (hasRequiredLodash__root) return lodash__root$1.exports;
  hasRequiredLodash__root = 1;
  (function(module, exports) {
    var objectTypes = {
      "function": true,
      "object": true
    };
    var freeExports = exports && !exports.nodeType ? exports : void 0;
    var freeModule = module && !module.nodeType ? module : void 0;
    var freeGlobal = checkGlobal(freeExports && freeModule && typeof commonjsGlobal == "object" && commonjsGlobal);
    var freeSelf = checkGlobal(objectTypes[typeof self] && self);
    var freeWindow = checkGlobal(objectTypes[typeof window] && window);
    var thisGlobal = checkGlobal(objectTypes[typeof lodash__root] && lodash__root);
    var root = freeGlobal || freeWindow !== (thisGlobal && thisGlobal.window) && freeWindow || freeSelf || thisGlobal || Function("return this")();
    function checkGlobal(value) {
      return value && value.Object === Object ? value : null;
    }
    module.exports = root;
  })(lodash__root$1, lodash__root$1.exports);
  return lodash__root$1.exports;
}
export {
  requireLodash__root as r
};

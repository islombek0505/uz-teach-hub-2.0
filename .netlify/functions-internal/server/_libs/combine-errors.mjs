import { g as getDefaultExportFromCjs } from "./react.mjs";
import { r as requireCustomErrorInstance } from "./custom-error-instance.mjs";
import { r as requireLodash_uniqby } from "./lodash.uniqby.mjs";
var combineErrors$1;
var hasRequiredCombineErrors;
function requireCombineErrors() {
  if (hasRequiredCombineErrors) return combineErrors$1;
  hasRequiredCombineErrors = 1;
  var Custom = requireCustomErrorInstance();
  var uniq = requireLodash_uniqby();
  var MultiError = Custom("MultiError");
  combineErrors$1 = error;
  function error(errors) {
    if (!(this instanceof error)) return new error(errors);
    errors = Array.isArray(errors) ? errors : [errors];
    errors = uniq(errors, function(err) {
      return err.stack;
    });
    if (errors.length === 1) return errors[0];
    var multierror = new MultiError({
      message: errors.map(function(err) {
        return err.message;
      }).join("; "),
      errors: errors.reduce(function(errs, err) {
        return errs.concat(err.errors || err);
      }, [])
    });
    multierror.__defineGetter__("stack", function() {
      return errors.map(function(err) {
        return err.stack;
      }).join("\n\n");
    });
    multierror.__defineSetter__("stack", function(value) {
      return [value].concat(multierror.stack).join("\n\n");
    });
    return multierror;
  }
  return combineErrors$1;
}
var combineErrorsExports = requireCombineErrors();
const combineErrors = /* @__PURE__ */ getDefaultExportFromCjs(combineErrorsExports);
export {
  combineErrors as c
};

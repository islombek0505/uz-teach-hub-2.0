var factories = {};
var hasRequiredFactories;
function requireFactories() {
  if (hasRequiredFactories) return factories;
  hasRequiredFactories = 1;
  factories.expectReceive = function(properties, configuration, factory) {
    var message;
    factory.root(properties, configuration, factory);
    message = this.message;
    if (properties.hasOwnProperty("expected")) message += " Expected " + properties.expected + ".";
    if (properties.hasOwnProperty("received")) message += " Received: " + properties.received + ".";
    this.message = message;
  };
  factories.root = function(properties, configuration, factories2) {
    var _this = this;
    var code;
    var config = { stackLength: Error.stackTraceLimit, rootOnly: true };
    var messageStr = "";
    var originalStackLength = Error.stackTraceLimit;
    var stack;
    function updateStack() {
      stack[0] = _this.toString();
      _this.stack = stack.join("\n");
    }
    if (!configuration || typeof configuration !== "object") configuration = {};
    if (configuration.hasOwnProperty("stackLength") && typeof configuration.stackLength === "number" && !isNaN(configuration.stackLength) && configuration.stackLength >= 0) config.stackLength = configuration.stackLength;
    if (!configuration.hasOwnProperty("rootOnly")) config.rootOnly = configuration.rootOnly;
    if (!config.rootOnly || this.CustomError.parent === Error) {
      Object.keys(properties).forEach(function(key) {
        switch (key) {
          case "code":
            code = properties.code || void 0;
            break;
          case "message":
            messageStr = properties.message || "";
            break;
          default:
            _this[key] = properties[key];
        }
      });
      Error.stackTraceLimit = config.stackLength + 2;
      stack = new Error().stack.split("\n");
      stack.splice(0, 3);
      stack.unshift("");
      Error.stackTraceLimit = originalStackLength;
      this.stack = stack.join("\n");
      Object.defineProperty(this, "code", {
        configurable: true,
        enumerable: true,
        get: function() {
          return code;
        },
        set: function(value) {
          code = value;
          updateStack();
        }
      });
      Object.defineProperty(this, "message", {
        configurable: true,
        enumerable: true,
        get: function() {
          return messageStr;
        },
        set: function(value) {
          messageStr = value;
          updateStack();
        }
      });
      updateStack();
    }
  };
  return factories;
}
var error;
var hasRequiredError;
function requireError() {
  if (hasRequiredError) return error;
  hasRequiredError = 1;
  error = CustomError;
  CustomError.factory = requireFactories();
  var Err = CustomError("CustomError");
  Err.order = CustomError(Err, { message: "Arguments out of order.", code: "EOARG" });
  function CustomError(name, parent, properties, factory) {
    var construct;
    var isRoot;
    parent = findArg(arguments, 1, Error, isParentArg, [isPropertiesArg, isFactoryArg]);
    properties = findArg(arguments, 2, {}, isPropertiesArg, [isFactoryArg]);
    factory = findArg(arguments, 3, noop, isFactoryArg, []);
    name = findArg(arguments, 0, parent === Error ? "Error" : parent.prototype.CustomError.name, isNameArg, [isParentArg, isPropertiesArg, isFactoryArg]);
    isRoot = parent === Error;
    if (isRoot && factory === noop) factory = CustomError.factory.root;
    construct = function(message, configuration) {
      var _this;
      var ar;
      var factories2;
      var i;
      var item;
      var props;
      if (!(this instanceof construct)) return new construct(message, configuration);
      delete this.constructor.name;
      Object.defineProperty(this.constructor, "name", {
        enumerable: false,
        configurable: true,
        value: name,
        writable: false
      });
      if (typeof message === "string") message = { message };
      if (!message) message = {};
      ar = this.CustomError.chain.slice(0).reverse().map(function(value) {
        return value.properties;
      });
      ar.push(message);
      ar.unshift({});
      props = Object.assign.apply(Object, ar);
      _this = this;
      factories2 = {};
      Object.keys(CustomError.factory).forEach(function(key) {
        factories2[key] = function(props2, config) {
          CustomError.factory[key].call(_this, props2, config, factories2);
        };
      });
      for (i = this.CustomError.chain.length - 1; i >= 0; i--) {
        item = this.CustomError.chain[i];
        if (item.factory !== noop) {
          item.factory.call(this, props, configuration, factories2);
        }
      }
    };
    construct.prototype = Object.create(parent.prototype);
    construct.prototype.constructor = construct;
    construct.prototype.name = name;
    construct.prototype.CustomError = {
      chain: isRoot ? [] : parent.prototype.CustomError.chain.slice(0),
      factory,
      name,
      parent,
      properties
    };
    construct.prototype.CustomError.chain.unshift(construct.prototype.CustomError);
    construct.prototype.toString = function() {
      var result = this.CustomError.chain[this.CustomError.chain.length - 1].name;
      if (this.code) result += " " + this.code;
      if (this.message) result += ": " + this.message;
      return result;
    };
    return construct;
  }
  function findArg(args, index, defaultValue, filter, antiFilters) {
    var anti = -1;
    var found = -1;
    var i;
    var j;
    var len = index < args.length ? index : args.length;
    var val;
    for (i = 0; i <= len; i++) {
      val = args[i];
      if (anti === -1) {
        for (j = 0; j < antiFilters.length; j++) {
          if (antiFilters[j](val)) anti = i;
        }
      }
      if (found === -1 && filter(val)) {
        found = i;
      }
    }
    if (found !== -1 && anti !== -1 && anti < found) throw new Err.order();
    return found !== -1 ? args[found] : defaultValue;
  }
  function isFactoryArg(value) {
    return typeof value === "function" && value !== Error && !value.prototype.CustomError;
  }
  function isNameArg(value) {
    return typeof value === "string";
  }
  function isParentArg(value) {
    return typeof value === "function" && (value === Error || value.prototype.CustomError);
  }
  function isPropertiesArg(value) {
    return value && typeof value === "object";
  }
  function noop() {
  }
  return error;
}
var customErrorInstance;
var hasRequiredCustomErrorInstance;
function requireCustomErrorInstance() {
  if (hasRequiredCustomErrorInstance) return customErrorInstance;
  hasRequiredCustomErrorInstance = 1;
  customErrorInstance = requireError();
  return customErrorInstance;
}
export {
  requireCustomErrorInstance as r
};

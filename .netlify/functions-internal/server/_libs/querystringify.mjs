var querystringify = {};
var hasRequiredQuerystringify;
function requireQuerystringify() {
  if (hasRequiredQuerystringify) return querystringify;
  hasRequiredQuerystringify = 1;
  var has = Object.prototype.hasOwnProperty, undef;
  function decode(input) {
    try {
      return decodeURIComponent(input.replace(/\+/g, " "));
    } catch (e) {
      return null;
    }
  }
  function encode(input) {
    try {
      return encodeURIComponent(input);
    } catch (e) {
      return null;
    }
  }
  function querystring(query) {
    var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
    while (part = parser.exec(query)) {
      var key = decode(part[1]), value = decode(part[2]);
      if (key === null || value === null || key in result) continue;
      result[key] = value;
    }
    return result;
  }
  function querystringify$1(obj, prefix) {
    prefix = prefix || "";
    var pairs = [], value, key;
    if ("string" !== typeof prefix) prefix = "?";
    for (key in obj) {
      if (has.call(obj, key)) {
        value = obj[key];
        if (!value && (value === null || value === undef || isNaN(value))) {
          value = "";
        }
        key = encode(key);
        value = encode(value);
        if (key === null || value === null) continue;
        pairs.push(key + "=" + value);
      }
    }
    return pairs.length ? prefix + pairs.join("&") : "";
  }
  querystringify.stringify = querystringify$1;
  querystringify.parse = querystring;
  return querystringify;
}
export {
  requireQuerystringify as r
};

import { g as getDefaultExportFromCjs } from "./react.mjs";
var isStream_1;
var hasRequiredIsStream;
function requireIsStream() {
  if (hasRequiredIsStream) return isStream_1;
  hasRequiredIsStream = 1;
  const isStream2 = (stream) => stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
  isStream2.writable = (stream) => isStream2(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
  isStream2.readable = (stream) => isStream2(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
  isStream2.duplex = (stream) => isStream2.writable(stream) && isStream2.readable(stream);
  isStream2.transform = (stream) => isStream2.duplex(stream) && typeof stream._transform === "function";
  isStream_1 = isStream2;
  return isStream_1;
}
var isStreamExports = requireIsStream();
const isStream = /* @__PURE__ */ getDefaultExportFromCjs(isStreamExports);
export {
  isStream as i
};

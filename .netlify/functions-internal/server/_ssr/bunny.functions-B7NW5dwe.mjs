import { c as createSsrRpc } from "./createSsrRpc-Cbl1egtb.mjs";
import { a as createServerFn } from "./server-B51iIGrX.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BCSfl_Vl.mjs";
const createBunnyVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("ec9f329ac6e2e6c860af70d32e72fbfd4ae44cdabbad18e6c8db716354c63001"));
const deleteBunnyVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("b3a80860006869225425b5ff89af690e952f1ccd3f2a97f6d4e93119514822d3"));
const getLessonPlayback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("5200432ce61ed2538961e1da440348eb4c6650f2370fa718d8e8991994daa9ec"));
export {
  createBunnyVideo as c,
  deleteBunnyVideo as d,
  getLessonPlayback as g
};

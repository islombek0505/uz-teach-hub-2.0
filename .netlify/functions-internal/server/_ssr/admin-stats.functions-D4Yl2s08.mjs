import { c as createSsrRpc } from "./createSsrRpc-Cbl1egtb.mjs";
import { a as createServerFn } from "./server-B51iIGrX.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BCSfl_Vl.mjs";
const getStudentsStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b015bb2731f1868381610b6fbd12897e996bd035169b632d203eebda96727b7d"));
const getStudentDetail = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("4efd53305823dc2db639567b5dcc33cdcb94a75c0f2464be2ce62e976f8016b7"));
export {
  getStudentDetail as a,
  getStudentsStats as g
};

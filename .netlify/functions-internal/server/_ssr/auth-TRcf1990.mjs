import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { G as GraduationCap } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
function AuthLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-h-screen lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex", style: {
      background: "var(--gradient-hero)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold", children: "LearnHub" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-bold leading-tight", children: '"Bilim — bu eng yaxshi sarmoya. Har kuni bir qadam oldinga."' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-white/70", children: "— LearnHub jamoasi" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 text-sm text-white/70", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-white", children: "287+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "faol o'quvchi"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-white", children: "60+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "video darsliklar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-white", children: "3+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "professional kurslar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 lg:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) })
  ] });
}
export {
  AuthLayout as component
};

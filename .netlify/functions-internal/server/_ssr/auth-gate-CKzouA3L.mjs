import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./auth-yqoVlx_c.mjs";
import { g as LoaderCircle } from "../_libs/lucide-react.mjs";
function AuthGate({ children, requireAdmin = false }) {
  const { loading, session, role } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth/login" });
      return;
    }
    if (requireAdmin && role && role !== "admin") {
      navigate({ to: "/app" });
    }
    if (!requireAdmin && role === "admin") {
      navigate({ to: "/admin" });
    }
  }, [loading, session, role, requireAdmin, navigate]);
  if (loading || !session || role === null || requireAdmin && role !== "admin" || !requireAdmin && role === "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  AuthGate as A
};

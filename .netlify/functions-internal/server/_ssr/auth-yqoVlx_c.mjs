import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./button-BXrfXN_b.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
function phoneToEmail(phone) {
  const digits = phone.replace(/\D+/g, "");
  return `${digits}@platform.local`;
}
function useAuth() {
  const [session, setSession] = reactExports.useState(null);
  const [role, setRole] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  reactExports.useEffect(() => {
    if (!session?.user) {
      setRole(null);
      return;
    }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
      const roles = (data ?? []).map((r) => r.role);
      setRole(roles.includes("admin") ? "admin" : "student");
    });
  }, [session?.user?.id]);
  return { session, user: session?.user ?? null, role, loading };
}
async function signOut() {
  await supabase.auth.signOut();
}
export {
  Input as I,
  phoneToEmail as p,
  signOut as s,
  useAuth as u
};

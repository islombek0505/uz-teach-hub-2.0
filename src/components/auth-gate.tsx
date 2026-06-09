import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function AuthGate({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { loading, session, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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

  if (loading || !session || (requireAdmin && role !== "admin") || (!requireAdmin && role === "admin")) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <>{children}</>;
}
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: Brand */}
      <div className="relative hidden flex-col justify-between p-12 text-primary-foreground lg:flex" style={{ background: "var(--gradient-hero)" }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">LearnHub</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            "Bilim — bu eng yaxshi sarmoya. Har kuni bir qadam oldinga."
          </h2>
          <p className="mt-4 text-white/70">— LearnHub jamoasi</p>
        </div>
        <div className="flex gap-6 text-sm text-white/70">
          <div><span className="font-display text-2xl font-bold text-white">287+</span><br />faol o'quvchi</div>
          <div><span className="font-display text-2xl font-bold text-white">60+</span><br />video darsliklar</div>
          <div><span className="font-display text-2xl font-bold text-white">3+</span><br />professional kurslar</div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
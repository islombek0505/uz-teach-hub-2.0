// Shared, glassmorphism-styled form primitives for the auth screens.
// Keeping them here means login + register stay consistent and the route
// files focus on flow logic, not markup.
import * as React from "react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Shared className for glass-styled OTP slots (used by login + register).
 * The base InputOTPSlot already adds `ring-1 ring-ring` when active. */
export const otpSlotClass =
  "glass-field !h-12 !w-11 !rounded-xl !border text-lg font-semibold shadow-none";

type FieldProps = React.ComponentProps<typeof Input> & {
  /** Optional — omit to render just the input (e.g. when the label sits on a custom row). */
  label?: string;
  icon: LucideIcon;
};

function FieldShell({
  id,
  label,
  children,
}: {
  id?: string;
  label?: string;
  children: React.ReactNode;
}) {
  if (!label) return <>{children}</>;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </Label>
      {children}
    </div>
  );
}

/** Labelled text/tel input with a leading icon, on a frosted field. */
export function AuthField({ id, label, icon: Icon, className, ...props }: FieldProps) {
  return (
    <FieldShell id={id} label={label}>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          className={cn("glass-field h-12 rounded-xl pl-11 text-[15px] shadow-none", className)}
          {...props}
        />
      </div>
    </FieldShell>
  );
}

/** Password field with a show/hide toggle. */
export function PasswordField({ id, label, icon: Icon, className, ...props }: FieldProps) {
  const [show, setShow] = useState(false);
  return (
    <FieldShell id={id} label={label}>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          type={show ? "text" : "password"}
          className={cn(
            "glass-field h-12 rounded-xl pl-11 pr-11 text-[15px] shadow-none",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Parolni yashirish" : "Parolni ko‘rsatish"}
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </FieldShell>
  );
}

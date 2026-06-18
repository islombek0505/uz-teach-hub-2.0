import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { I as Input, p as phoneToEmail } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { L as Lt, j as jt } from "../_libs/input-otp.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { U as User, P as Phone, r as ArrowLeft, t as Lock, u as Minus } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const InputOTP = reactExports.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Lt,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  }
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center", className), ...props }));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = reactExports.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = reactExports.useContext(jt);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = reactExports.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, role: "separator", ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, {}) }));
InputOTPSeparator.displayName = "InputOTPSeparator";
function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState("info");
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const sendSms = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D+/g, "");
    if (!digits.startsWith("998") || digits.length !== 12) {
      return toast.error("+998 bilan boshlanadigan 12 raqamli telefon kiriting");
    }
    toast.success("SMS kod yuborildi (demo: istalgan 6 raqam)");
    setStep("otp");
  };
  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("6 xonali kod kiriting");
    if (!/^\d{6}$/.test(otp)) return toast.error("Faqat raqam kiriting");
    toast.success("Kod tasdiqlandi");
    setStep("password");
  };
  const finish = async (e) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Parol kamida 8 ta belgi bo'lsin");
    if (password !== confirm) return toast.error("Parollar mos kelmadi");
    setLoading(true);
    try {
      const email = phoneToEmail(phone);
      const {
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            full_name: name,
            phone: phone.replace(/\D+/g, "")
          }
        }
      });
      if (error) {
        toast.error(error.message.includes("registered") ? "Bu raqam allaqachon ro'yxatdan o'tgan" : error.message);
        return;
      }
      await supabase.auth.signInWithPassword({
        email,
        password
      });
      toast.success("Ro'yxatdan o'tdingiz!");
      navigate({
        to: "/app"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex items-center gap-1 text-xs", children: ["info", "otp", "password"].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 flex-1 rounded-full ${["info", "otp", "password"].indexOf(step) >= i ? "bg-primary" : "bg-muted"}` }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 font-display text-3xl font-bold tracking-tight", children: [
      step === "info" && "Ro'yxatdan o'tish",
      step === "otp" && "Telefonni tasdiqlang",
      step === "password" && "Parol o'rnatish"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
      step === "info" && "Birinchi marta ro'yxatdan o'tyapsiz — SMS kod yuboriladi",
      step === "otp" && `${phone} raqamiga yuborilgan 6 xonali kodni kiriting`,
      step === "password" && "O'zingiz uchun ishonchli parol o'ylang"
    ] }),
    step === "info" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: sendSms, className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Ism Familiya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", placeholder: "Akmal Yusupov", value: name, onChange: (e) => setName(e.target.value), className: "pl-10", required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Telefon raqam" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", type: "tel", placeholder: "+998 90 123 45 67", value: phone, onChange: (e) => setPhone(e.target.value), className: "pl-10", required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", size: "lg", children: "SMS kod yuborish" })
    ] }),
    step === "otp" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: verifyOtp, className: "mt-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTP, { maxLength: 6, value: otp, onChange: setOtp, children: /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPGroup, { children: [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(InputOTPSlot, { index: i }, i)) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", size: "lg", children: "Tasdiqlash" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setStep("info"), className: "flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
        " Raqamni o'zgartirish"
      ] })
    ] }),
    step === "password" && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: finish, className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Yangi parol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", placeholder: "kamida 8 ta belgi", value: password, onChange: (e) => setPassword(e.target.value), className: "pl-10", required: true, minLength: 8 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirm", children: "Parolni tasdiqlang" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirm", type: "password", placeholder: "••••••••", value: confirm, onChange: (e) => setConfirm(e.target.value), className: "pl-10", required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", size: "lg", disabled: loading, children: loading ? "Yaratilmoqda..." : "Hisobni yaratish" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "Hisobingiz bormi?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", className: "font-medium text-primary hover:underline", children: "Kirish" })
    ] })
  ] });
}
export {
  RegisterPage as component
};

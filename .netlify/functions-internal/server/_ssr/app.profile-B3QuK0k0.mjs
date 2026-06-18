import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useAuth, I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { A as AvatarUploader } from "./avatar-uploader-DC6MrbFA.mjs";
import { E as Send, I as Instagram } from "../_libs/lucide-react.mjs";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function ProfilePage() {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [isMentor, setIsMentor] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({
      data
    }) => setProfile(data ?? {}));
    supabase.from("user_roles").select("role").eq("user_id", user.id).then(({
      data
    }) => {
      setIsMentor((data ?? []).some((r) => r.role === "mentor"));
    });
  }, [user?.id]);
  const save = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: profile.full_name ?? "",
      email: profile.email || null,
      birth_date: profile.birth_date || null,
      city: profile.city || null,
      ...isMentor ? {
        telegram_url: profile.telegram_url || null,
        instagram_url: profile.instagram_url || null,
        headline: profile.headline || null,
        bio: profile.bio || null,
        experience_years: profile.experience_years === "" || profile.experience_years == null ? null : Number(profile.experience_years),
        expertise: typeof profile.expertiseText === "string" ? profile.expertiseText.split(",").map((s) => s.trim()).filter(Boolean) : profile.expertise ?? []
      } : {}
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ma'lumotlar saqlandi");
  };
  const changePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newPass = form.elements.namedItem("newPass").value;
    const confirm = form.elements.namedItem("confirmPass").value;
    if (newPass.length < 6) {
      toast.error("Parol kamida 6 ta belgi bo'lsin");
      return;
    }
    if (newPass !== confirm) {
      toast.error("Parollar mos emas");
      return;
    }
    const {
      error
    } = await supabase.auth.updateUser({
      password: newPass
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Parol yangilandi");
    form.reset();
  };
  if (!profile) return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Mening profilim" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Yuklanmoqda..." }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Mening profilim" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarUploader, { userId: user.id, url: profile.avatar_url, name: profile.full_name, size: 96, onChange: (u) => setProfile({
          ...profile,
          avatar_url: u
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: profile.full_name || "Foydalanuvchi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: profile.phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Ro'yxatdan o'tgan: ",
            profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Shaxsiy ma'lumotlar" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ism Familiya" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.full_name || "", onChange: (e) => setProfile({
                ...profile,
                full_name: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefon raqam" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.phone || "", disabled: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email (ixtiyoriy)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: profile.email || "", onChange: (e) => setProfile({
                ...profile,
                email: e.target.value
              }), placeholder: "email@example.com" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tug'ilgan sana" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: profile.birth_date || "", onChange: (e) => setProfile({
                ...profile,
                birth_date: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Shahar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.city || "", onChange: (e) => setProfile({
                ...profile,
                city: e.target.value
              }), placeholder: "Toshkent" })
            ] }),
            isMentor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Kasbiy unvon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.headline || "", onChange: (e) => setProfile({
                  ...profile,
                  headline: e.target.value
                }), placeholder: "Senior Frontend Mentor" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tajriba (yil)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: profile.experience_years ?? "", onChange: (e) => setProfile({
                  ...profile,
                  experience_years: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mutaxassislik (vergul bilan)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.expertiseText ?? (Array.isArray(profile.expertise) ? profile.expertise.join(", ") : ""), onChange: (e) => setProfile({
                  ...profile,
                  expertiseText: e.target.value
                }), placeholder: "Frontend, React, UI/UX" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: profile.bio || "", onChange: (e) => setProfile({
                  ...profile,
                  bio: e.target.value
                }), placeholder: "O'zingiz haqingizda qisqacha" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }),
                  " Telegram URL"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.telegram_url || "", onChange: (e) => setProfile({
                  ...profile,
                  telegram_url: e.target.value
                }), placeholder: "https://t.me/username" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-3.5 w-3.5" }),
                  " Instagram URL"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile.instagram_url || "", onChange: (e) => setProfile({
                  ...profile,
                  instagram_url: e.target.value
                }), placeholder: "https://instagram.com/username" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, children: saving ? "Saqlanmoqda..." : "Saqlash" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Parolni o'zgartirish" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: changePassword, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Yangi parol" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "newPass", type: "password", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tasdiqlang" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "confirmPass", type: "password", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Parolni yangilash" })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProfilePage as component
};

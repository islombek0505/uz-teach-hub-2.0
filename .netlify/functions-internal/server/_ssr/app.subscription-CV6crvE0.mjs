import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { u as useAuth, I as Input } from "./auth-yqoVlx_c.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-sifHCTRo.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { e as Crown, h as Sparkles, v as Copy, C as CreditCard, w as Upload, F as Facebook, Y as Youtube, x as Globe, y as Mail, I as Instagram, z as MessageCircle, P as Phone, E as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
function SubscriptionPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const copy = (t) => {
    navigator.clipboard.writeText(t);
    toast.success("Nusxa olindi");
  };
  const {
    data
  } = useQuery({
    enabled: !!user,
    queryKey: ["app", "subscription", user?.id],
    queryFn: async () => {
      const [{
        data: plans
      }, {
        data: userPlan2
      }, {
        data: profile
      }, {
        data: payments
      }, {
        data: cards
      }, {
        data: channels
      }] = await Promise.all([supabase.from("plans").select("*").eq("is_active", true).order("sort_order"), supabase.from("user_plan").select("*, plans(title, duration_days)").eq("user_id", user.id).maybeSingle(), supabase.from("profiles").select("trial_activated_at").eq("id", user.id).maybeSingle(), supabase.from("payments").select("id, amount, status, created_at, plans(title)").eq("user_id", user.id).order("created_at", {
        ascending: false
      }), supabase.from("payment_cards").select("*").eq("is_active", true).order("sort_order"), supabase.from("contact_channels").select("*").eq("is_active", true).order("sort_order")]);
      return {
        plans: plans ?? [],
        userPlan: userPlan2,
        profile,
        payments: payments ?? [],
        cards: cards ?? [],
        channels: channels ?? []
      };
    }
  });
  const activateTrial = useMutation({
    mutationFn: async () => {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
      const {
        error: e1
      } = await supabase.from("profiles").update({
        trial_activated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", user.id);
      if (e1) throw e1;
      const {
        error: e2
      } = await supabase.from("user_plan").upsert({
        user_id: user.id,
        plan_id: null,
        is_trial: true,
        started_at: (/* @__PURE__ */ new Date()).toISOString(),
        expires_at: expires.toISOString()
      }, {
        onConflict: "user_id"
      });
      if (e2) throw e2;
    },
    onSuccess: () => {
      toast.success("Sinov muddati aktivlashtirildi!");
      qc.invalidateQueries({
        queryKey: ["app", "subscription"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const iconFor = (type) => ({
    telegram: Send,
    phone: Phone,
    whatsapp: MessageCircle,
    instagram: Instagram,
    email: Mail,
    website: Globe,
    youtube: Youtube,
    facebook: Facebook
  })[type] ?? Phone;
  const userPlan = data?.userPlan;
  const planActive = !!userPlan && (!userPlan.expires_at || new Date(userPlan.expires_at) > /* @__PURE__ */ new Date());
  const trialUsed = !!data?.profile?.trial_activated_at;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Tarif va to'lov" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: planActive ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: planActive ? userPlan.is_trial ? "Sinov muddati faol" : userPlan.plans?.title ?? "Tarif faol" : "Akkountingiz tarifsiz" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: planActive ? `Tugaydi: ${userPlan.expires_at ? new Date(userPlan.expires_at).toLocaleDateString("uz-UZ") : "muddatsiz"}` : "Video darslarni ko'rish uchun tarif sotib oling" })
          ] })
        ] }),
        !planActive && !trialUsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => activateTrial.mutate(), disabled: activateTrial.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
          " 1 haftalik bepul sinovni boshlash"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Tariflarni tanlang" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          (data?.plans ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Hozircha tariflar yo'q." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: (data?.plans ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-2 transition-colors hover:border-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: p.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-bold", children: fmt(Number(p.price)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              p.duration_days,
              " kun • barcha kurslarga ruxsat"
            ] }),
            p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: p.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PayDialog, { plan: p, userId: user.id, cards: data?.cards ?? [], onDone: () => qc.invalidateQueries({
              queryKey: ["app", "subscription"]
            }) })
          ] }) }, p.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "To'lov uchun ma'lumotlar" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          (data?.cards ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-4 text-sm text-muted-foreground", children: "To'lov kartalari sozlanmagan." }),
          (data?.cards ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/30 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase text-muted-foreground", children: [
              c.label,
              c.bank ? ` • ${c.bank}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold tracking-wider sm:text-2xl", children: c.card_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => copy(c.card_number.replace(/\s+/g, "")), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1 h-3.5 w-3.5" }),
                " Nusxa"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: c.holder_name })
          ] }, c.id)),
          (data?.channels ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: (data?.channels ?? []).map((c) => {
            const Icon = iconFor(c.type);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.url || "#", target: c.type === "phone" || c.type === "email" ? void 0 : "_blank", rel: "noreferrer", className: "flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium", children: c.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm text-muted-foreground", children: c.value })
              ] })
            ] }, c.id);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "To'lovlar tarixi" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          (data?.payments ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "To'lovlar tarixi bo'sh" }),
          (data?.payments ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-lg border p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: fmt(Number(p.amount)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                p.plans?.title ?? "—",
                " • ",
                new Date(p.created_at).toLocaleDateString("uz-UZ")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: p.status === "approved" ? "bg-success text-success-foreground" : p.status === "rejected" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground", children: p.status === "approved" ? "Tasdiqlangan" : p.status === "rejected" ? "Rad etilgan" : "Kutilmoqda" })
          ] }, p.id))
        ] }) })
      ] })
    ] })
  ] });
}
function PayDialog({
  plan,
  userId,
  cards,
  onDone
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [file, setFile] = reactExports.useState(null);
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      let receipt_url = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${userId}/${plan.id}/${Date.now()}.${ext}`;
        const {
          error: upErr
        } = await supabase.storage.from("receipts").upload(path, file, {
          upsert: false
        });
        if (upErr) throw upErr;
        receipt_url = path;
      }
      const {
        error
      } = await supabase.from("payments").insert({
        user_id: userId,
        plan_id: plan.id,
        amount: plan.price,
        note: note || null,
        receipt_url,
        status: "pending"
      });
      if (error) throw error;
      toast.success("To'lov yuborildi! Admin tasdiqlashini kuting.");
      onDone();
      setOpen(false);
      setFile(null);
      setNote("");
    } catch (err) {
      toast.error(err.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mr-2 h-4 w-4" }),
      " Sotib olish"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display", children: [
        plan.title,
        " — to'lov"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        cards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase text-muted-foreground", children: [
            cards[0].label,
            cards[0].bank ? ` • ${cards[0].bank}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold tracking-wider", children: cards[0].card_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: cards[0].holder_name })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Summa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fmt(Number(plan.price)), disabled: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Chek rasmi (ixtiyoriy)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 text-sm text-muted-foreground hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: file ? file.name : "Chek skrinshotni tanlang" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*,application/pdf", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] ?? null) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Eslatma (ixtiyoriy)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: note, onChange: (e) => setNote(e.target.value), placeholder: "Masalan: Telegram username yoki transfer raqami" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Yuborilmoqda..." : "Yuborish" }) })
      ] })
    ] })
  ] });
}
export {
  SubscriptionPage as component
};

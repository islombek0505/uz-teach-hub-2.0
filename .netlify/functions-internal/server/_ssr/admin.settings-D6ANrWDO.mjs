import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { S as Switch } from "./switch-DDHih_sy.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-c5KQ8wMi.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-sifHCTRo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { f as Settings, C as CreditCard, E as Send, X as Building2, Z as Plus, _ as Eye, $ as EyeOff, a0 as Pencil, a1 as Trash2, P as Phone, z as MessageCircle, I as Instagram, y as Mail, x as Globe, Y as Youtube, F as Facebook } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const CHANNEL_TYPES = [{
  value: "telegram",
  label: "Telegram",
  icon: Send,
  prefix: "https://t.me/"
}, {
  value: "phone",
  label: "Telefon",
  icon: Phone,
  prefix: "tel:"
}, {
  value: "whatsapp",
  label: "WhatsApp",
  icon: MessageCircle,
  prefix: "https://wa.me/"
}, {
  value: "instagram",
  label: "Instagram",
  icon: Instagram,
  prefix: "https://instagram.com/"
}, {
  value: "email",
  label: "Email",
  icon: Mail,
  prefix: "mailto:"
}, {
  value: "website",
  label: "Veb-sayt",
  icon: Globe,
  prefix: "https://"
}, {
  value: "youtube",
  label: "YouTube",
  icon: Youtube,
  prefix: "https://youtube.com/"
}, {
  value: "facebook",
  label: "Facebook",
  icon: Facebook,
  prefix: "https://facebook.com/"
}];
function channelMeta(type) {
  return CHANNEL_TYPES.find((c) => c.value === type) ?? CHANNEL_TYPES[0];
}
function AdminSettings() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Sozlamalar", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Platforma sozlamalari" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aloqa kanallari, to'lov kartalari va tizim parametrlari" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "platform", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "platform", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-1.5 h-4 w-4" }),
            "Platforma"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "cards", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mr-1.5 h-4 w-4" }),
            "Kartalar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "channels", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-1.5 h-4 w-4" }),
            "Aloqa"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "system", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "mr-1.5 h-4 w-4" }),
            "Tizim"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "platform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformTab, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cards", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardsTab, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "channels", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelsTab, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "system", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SystemTab, {}) })
      ] })
    ] })
  ] });
}
function useSetting(key) {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("platform_settings").select("value").eq("key", key).maybeSingle();
      return data?.value ?? {};
    }
  });
}
function useSaveSetting(key) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value) => {
      const {
        error
      } = await supabase.from("platform_settings").upsert({
        key,
        value,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saqlandi");
      qc.invalidateQueries({
        queryKey: ["settings", key]
      });
    },
    onError: (e) => toast.error(e.message)
  });
}
function PlatformTab() {
  const {
    data,
    isLoading
  } = useSetting("platform");
  const save = useSaveSetting("platform");
  const [form, setForm] = reactExports.useState({
    name: "",
    tagline: ""
  });
  reactExports.useEffect(() => {
    if (data) setForm({
      name: data.name ?? "",
      tagline: data.tagline ?? ""
    });
  }, [data]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-muted-foreground", children: "Yuklanmoqda..." }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Asosiy ma'lumotlar" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      save.mutate(form);
    }, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Platforma nomi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), placeholder: "LearnHub" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Shior / Tagline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.tagline, onChange: (e) => setForm({
          ...form,
          tagline: e.target.value
        }), placeholder: "Online ta'lim platformasi" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: save.isPending, children: save.isPending ? "Saqlanmoqda..." : "Saqlash" })
    ] }) })
  ] });
}
function SystemTab() {
  const {
    data,
    isLoading
  } = useSetting("system");
  const save = useSaveSetting("system");
  const [form, setForm] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (data) setForm(data);
  }, [data]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-muted-foreground", children: "Yuklanmoqda..." }) });
  const items = [{
    key: "allow_registration",
    label: "Yangi ro'yxatdan o'tishlarga ruxsat",
    desc: "Yangi o'quvchilar ro'yxatdan o'tishi mumkinmi"
  }, {
    key: "sms_verification",
    label: "SMS tasdiqlash",
    desc: "Ro'yxatdan o'tishda SMS kod yuborish"
  }, {
    key: "block_video_download",
    label: "Video yuklab olishni bloklash",
    desc: "O'quvchilar videolarni yuklab olmasin"
  }, {
    key: "auto_expire_subscriptions",
    label: "Avtomatik obuna tugashi",
    desc: "Muddati tugagan obuna bloklansin"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Tizim parametrlari" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: it.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: it.desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!form[it.key], onCheckedChange: (v) => setForm({
          ...form,
          [it.key]: v
        }) })
      ] }, it.key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save.mutate(form), disabled: save.isPending, children: save.isPending ? "Saqlanmoqda..." : "Saqlash" })
    ] })
  ] });
}
function CardsTab() {
  const qc = useQueryClient();
  const {
    data: cards = [],
    isLoading
  } = useQuery({
    queryKey: ["payment_cards"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("payment_cards").select("*").order("sort_order").order("created_at");
      return data ?? [];
    }
  });
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const toggleActive = useMutation({
    mutationFn: async (c) => {
      const {
        error
      } = await supabase.from("payment_cards").update({
        is_active: !c.is_active
      }).eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["payment_cards"]
    })
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("payment_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({
        queryKey: ["payment_cards"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "To'lov kartalari" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "O'quvchilar qaysi kartalarga to'lov qilishi mumkinligini boshqaring" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (o) => {
        setOpen(o);
        if (!o) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Qo'shish"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDialog, { card: editing, onClose: () => {
          setOpen(false);
          setEditing(null);
        }, onSaved: () => {
          setOpen(false);
          setEditing(null);
          qc.invalidateQueries({
            queryKey: ["payment_cards"]
          });
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Yuklanmoqda..." }),
      !isLoading && cards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground", children: "Hozircha karta yo'q" }),
      cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c.label }),
            !c.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Yashirin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-sm tracking-wider", children: c.card_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            c.holder_name,
            c.bank ? ` • ${c.bank}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", title: c.is_active ? "Yashirish" : "Ko'rsatish", onClick: () => toggleActive.mutate(c), children: c.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
            setEditing(c);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-destructive", onClick: () => confirm(`"${c.label}" kartasini o'chirilsinmi?`) && remove.mutate(c.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }, c.id))
    ] })
  ] });
}
function CardDialog({
  card,
  onClose,
  onSaved
}) {
  const [form, setForm] = reactExports.useState({
    label: "",
    card_number: "",
    holder_name: "",
    bank: "",
    is_active: true,
    sort_order: 0
  });
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (card) setForm({
      ...card,
      bank: card.bank ?? ""
    });
    else setForm({
      label: "",
      card_number: "",
      holder_name: "",
      bank: "",
      is_active: true,
      sort_order: 0
    });
  }, [card]);
  const submit = async () => {
    if (!form.label.trim() || !form.card_number.trim() || !form.holder_name.trim()) {
      toast.error("Majburiy maydonlarni to'ldiring");
      return;
    }
    setBusy(true);
    const payload = {
      label: form.label.trim(),
      card_number: form.card_number.trim(),
      holder_name: form.holder_name.trim(),
      bank: form.bank?.trim() || null,
      is_active: !!form.is_active,
      sort_order: Number(form.sort_order) || 0
    };
    const {
      error
    } = card ? await supabase.from("payment_cards").update(payload).eq("id", card.id) : await supabase.from("payment_cards").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(card ? "Yangilandi" : "Qo'shildi");
    onSaved();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: card ? "Kartani tahrirlash" : "Yangi karta" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Karta nomi *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.label, onChange: (e) => setForm({
          ...form,
          label: e.target.value
        }), placeholder: "Asosiy karta" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Karta raqami *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.card_number, onChange: (e) => setForm({
          ...form,
          card_number: e.target.value
        }), placeholder: "8600 1234 5678 9012" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Egasi *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.holder_name, onChange: (e) => setForm({
            ...form,
            holder_name: e.target.value
          }), placeholder: "Familiya I.O." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bank / Turi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.bank, onChange: (e) => setForm({
            ...form,
            bank: e.target.value
          }), placeholder: "Humo / Uzcard" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tartib" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.sort_order, onChange: (e) => setForm({
            ...form,
            sort_order: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Faol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!form.is_active, onCheckedChange: (v) => setForm({
            ...form,
            is_active: v
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Bekor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? "Saqlanmoqda..." : "Saqlash" })
    ] })
  ] });
}
function ChannelsTab() {
  const qc = useQueryClient();
  const {
    data: list = [],
    isLoading
  } = useQuery({
    queryKey: ["contact_channels"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("contact_channels").select("*").order("sort_order").order("created_at");
      return data ?? [];
    }
  });
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const toggleActive = useMutation({
    mutationFn: async (c) => {
      const {
        error
      } = await supabase.from("contact_channels").update({
        is_active: !c.is_active
      }).eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["contact_channels"]
    })
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("contact_channels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({
        queryKey: ["contact_channels"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Aloqa kanallari" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Telegram, telefon, ijtimoiy tarmoqlar — bir nechta qo'shish mumkin" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (o) => {
        setOpen(o);
        if (!o) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Qo'shish"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelDialog, { channel: editing, onClose: () => {
          setOpen(false);
          setEditing(null);
        }, onSaved: () => {
          setOpen(false);
          setEditing(null);
          qc.invalidateQueries({
            queryKey: ["contact_channels"]
          });
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Yuklanmoqda..." }),
      !isLoading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground", children: "Hozircha aloqa kanali yo'q" }),
      list.map((c) => {
        const meta = channelMeta(c.type);
        const Icon = meta.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: meta.label }),
              !c.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Yashirin" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm", children: c.value }),
            c.url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-muted-foreground", children: c.url })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => toggleActive.mutate(c), children: c.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
              setEditing(c);
              setOpen(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-destructive", onClick: () => confirm(`"${c.label}" o'chirilsinmi?`) && remove.mutate(c.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }, c.id);
      })
    ] })
  ] });
}
function ChannelDialog({
  channel,
  onClose,
  onSaved
}) {
  const [form, setForm] = reactExports.useState({
    type: "telegram",
    label: "",
    value: "",
    url: "",
    is_active: true,
    sort_order: 0
  });
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (channel) setForm({
      ...channel,
      url: channel.url ?? ""
    });
    else setForm({
      type: "telegram",
      label: "",
      value: "",
      url: "",
      is_active: true,
      sort_order: 0
    });
  }, [channel]);
  const submit = async () => {
    if (!form.label.trim() || !form.value.trim()) {
      toast.error("Nom va qiymat majburiy");
      return;
    }
    setBusy(true);
    const meta = channelMeta(form.type);
    let url = form.url?.trim();
    if (!url) {
      const v = form.value.trim().replace(/^@/, "");
      if (form.type === "phone") url = `tel:${v.replace(/\s+/g, "")}`;
      else if (form.type === "whatsapp") url = `${meta.prefix}${v.replace(/\D+/g, "")}`;
      else if (form.type === "email") url = `mailto:${v}`;
      else if (form.type === "website") url = v.startsWith("http") ? v : `https://${v}`;
      else url = `${meta.prefix}${v}`;
    }
    const payload = {
      type: form.type,
      label: form.label.trim(),
      value: form.value.trim(),
      url,
      is_active: !!form.is_active,
      sort_order: Number(form.sort_order) || 0
    };
    const {
      error
    } = channel ? await supabase.from("contact_channels").update(payload).eq("id", channel.id) : await supabase.from("contact_channels").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(channel ? "Yangilandi" : "Qo'shildi");
    onSaved();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: channel ? "Aloqa kanalini tahrirlash" : "Yangi aloqa kanali" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Turi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.type, onValueChange: (v) => setForm({
          ...form,
          type: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CHANNEL_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nomi *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.label, onChange: (e) => setForm({
          ...form,
          label: e.target.value
        }), placeholder: "Asosiy operator" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Qiymat *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.value, onChange: (e) => setForm({
          ...form,
          value: e.target.value
        }), placeholder: "@username yoki +998..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "URL (ixtiyoriy — bo'sh qoldirsangiz avtomatik yaratiladi)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.url, onChange: (e) => setForm({
          ...form,
          url: e.target.value
        }), placeholder: "https://t.me/username" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tartib" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.sort_order, onChange: (e) => setForm({
            ...form,
            sort_order: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Faol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!form.is_active, onCheckedChange: (v) => setForm({
            ...form,
            is_active: v
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Bekor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? "Saqlanmoqda..." : "Saqlash" })
    ] })
  ] });
}
export {
  AdminSettings as component
};

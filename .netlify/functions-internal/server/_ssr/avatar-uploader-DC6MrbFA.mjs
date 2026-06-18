import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as Avatar, c as AvatarImage, d as AvatarFallback } from "./topbar-OGx_zO3a.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as LoaderCircle, a4 as Camera, a1 as Trash2 } from "../_libs/lucide-react.mjs";
const ONE_YEAR = 60 * 60 * 24 * 365;
async function createAvatarSignedUrl(path) {
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, ONE_YEAR);
  return data?.signedUrl ?? null;
}
function AvatarUploader({
  userId,
  url,
  name,
  size = 96,
  onChange
}) {
  const inputRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const initials = (name || "U").split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const handleFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm yuklash mumkin");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5MB dan oshmasin");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const signedUrl = await createAvatarSignedUrl(path);
      if (!signedUrl) throw new Error("URL yaratib bo'lmadi");
      const { error: updErr } = await supabase.from("profiles").update({ avatar_url: signedUrl }).eq("id", userId);
      if (updErr) throw updErr;
      onChange?.(signedUrl);
      toast.success("Profil rasmi yangilandi");
    } catch (e) {
      toast.error(e.message || "Yuklashda xatolik");
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
      if (error) throw error;
      onChange?.(null);
      toast.success("Rasm olib tashlandi");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { style: { width: size, height: size }, children: [
        url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: url, alt: name ?? "" }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-2xl font-display font-semibold text-primary-foreground", children: initials })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => inputRef.current?.click(),
          disabled: busy,
          className: "absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-50",
          "aria-label": "Rasm yuklash",
          children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" })
        }
      )
    ] }),
    url && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "h-7 text-xs text-destructive", onClick: remove, disabled: busy, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3 w-3" }),
      " Olib tashlash"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }
      }
    )
  ] });
}
export {
  AvatarUploader as A
};

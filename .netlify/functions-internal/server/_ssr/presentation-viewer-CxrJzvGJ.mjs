import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { aj as Presentation, W as ChevronLeft, R as ChevronRight } from "../_libs/lucide-react.mjs";
function PresentationSlidesViewer({ slides, title, className, bucket = "presentations" }) {
  const [urls, setUrls] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [index, setIndex] = reactExports.useState(0);
  const key = reactExports.useMemo(() => slides.join("|"), [slides]);
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setIndex(0);
      try {
        const storagePaths = slides.filter((s) => !s.startsWith("http"));
        let signedMap = {};
        if (storagePaths.length) {
          const { data, error: error2 } = await supabase.storage.from(bucket).createSignedUrls(storagePaths, 60 * 60);
          if (error2) throw error2;
          for (const item of data ?? []) {
            if (item.path && item.signedUrl) signedMap[item.path] = item.signedUrl;
          }
        }
        const resolved = slides.map((s) => s.startsWith("http") ? s : signedMap[s] ?? null);
        if (!cancelled) setUrls(resolved);
      } catch (e) {
        if (!cancelled) setError(e.message ?? "Xatolik");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key, bucket]);
  if (!slides.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`, children: "Slaydlar qo'shilmagan" });
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`, children: "Yuklanmoqda..." });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid aspect-video place-items-center rounded-lg border bg-destructive/10 p-4 text-center text-sm text-destructive ${className ?? ""}`, children: error });
  const current = urls[index];
  const total = slides.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `overflow-hidden rounded-lg border bg-card ${className ?? ""}`,
      onContextMenu: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-4 w-4 flex-shrink-0 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-medium", children: title ?? "Prezentatsiya" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Faqat ko'rish uchun • ",
            index + 1,
            " / ",
            total
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid place-items-center bg-black select-none", children: [
          current ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: current,
              alt: `Slayd ${index + 1}`,
              draggable: false,
              onDragStart: (e) => e.preventDefault(),
              className: "block max-h-[70vh] w-full object-contain"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid aspect-video w-full place-items-center text-sm text-white/70", children: "Slayd yuklanmadi" }),
          total > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "secondary",
                size: "icon",
                onClick: prev,
                className: "absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-90",
                "aria-label": "Oldingi slayd",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "secondary",
                size: "icon",
                onClick: next,
                className: "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-90",
                "aria-label": "Keyingi slayd",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  PresentationSlidesViewer as P
};

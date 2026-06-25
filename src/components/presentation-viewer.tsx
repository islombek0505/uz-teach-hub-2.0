import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronLeft,
  ChevronRight,
  Presentation as PresentationIcon,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Ordered list of storage paths (inside the given bucket) or full HTTPS URLs */
  slides: string[];
  title?: string;
  className?: string;
  /** Storage bucket name. Defaults to "presentations". */
  bucket?: string;
};

/**
 * View-only image carousel for a presentation built as a sequence of slide
 * images. Downloading is blocked at the UI level (no download buttons,
 * disabled context menu, disabled drag).
 */
export function PresentationSlidesViewer({
  slides,
  title,
  className,
  bucket = "presentations",
}: Props) {
  const [urls, setUrls] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const key = useMemo(() => slides.join("|"), [slides]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setIndex(0);
      try {
        const storagePaths = slides.filter((s) => !s.startsWith("http"));
        let signedMap: Record<string, string> = {};
        if (storagePaths.length) {
          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrls(storagePaths, 60 * 60);
          if (error) throw error;
          for (const item of data ?? []) {
            if (item.path && item.signedUrl) signedMap[item.path] = item.signedUrl;
          }
        }
        const resolved = slides.map((s) => (s.startsWith("http") ? s : (signedMap[s] ?? null)));
        if (!cancelled) setUrls(resolved);
      } catch (e: any) {
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
    return (
      <div
        className={`grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`}
      >
        Slaydlar qo'shilmagan
      </div>
    );
  }
  if (loading)
    return (
      <div
        className={`grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`}
      >
        Yuklanmoqda...
      </div>
    );
  if (error)
    return (
      <div
        className={`grid aspect-video place-items-center rounded-lg border bg-destructive/10 p-4 text-center text-sm text-destructive ${className ?? ""}`}
      >
        {error}
      </div>
    );

  const current = urls[index];
  const total = slides.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div
      className={`overflow-hidden rounded-lg border bg-card ${className ?? ""}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <PresentationIcon className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="truncate font-medium">{title ?? "Prezentatsiya"}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Faqat ko'rish uchun • {index + 1} / {total}
        </span>
      </div>
      <div className="relative grid place-items-center bg-black select-none">
        {current ? (
          <img
            src={current}
            alt={`Slayd ${index + 1}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="block max-h-[70vh] w-full object-contain"
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center text-sm text-white/70">
            Slayd yuklanmadi
          </div>
        )}
        {total > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-90"
              aria-label="Oldingi slayd"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-90"
              aria-label="Keyingi slayd"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Renders a self-contained HTML presentation deck inside a sandboxed iframe.
 *
 * The HTML is loaded as TEXT and injected via `srcDoc` (not via `src`), so the
 * deck always renders as HTML regardless of the `Content-Type` the file was
 * stored with in Supabase Storage. Pointing an iframe `src` at the signed URL
 * makes rendering depend on that stored mime type — if it isn't exactly
 * `text/html` the browser shows the raw source instead of the slides.
 *
 * SECURITY: the iframe uses `sandbox="allow-scripts"` WITHOUT `allow-same-origin`,
 * so the deck's own scripts run (slide navigation, animations) but the document
 * is forced into an opaque origin — it cannot read the app's cookies/localStorage
 * (auth tokens), cannot reach `window.parent`, and cannot navigate the top page.
 */
export function HtmlPresentationViewer({
  path,
  title,
  className,
  bucket = "presentations",
}: {
  /** Storage path of the HTML file, or a full HTTPS URL. */
  path: string;
  title?: string;
  className?: string;
  bucket?: string;
}) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setHtml(null);
      setError(null);
      try {
        let text: string;
        if (path.startsWith("http")) {
          const res = await fetch(path);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          text = await res.text();
        } else {
          // Download via the authenticated client (respects storage RLS) and
          // read the bytes as text — the stored Content-Type is irrelevant.
          const { data, error } = await supabase.storage.from(bucket).download(path);
          if (error || !data) throw error ?? new Error("Yuklab bo'lmadi");
          text = await data.text();
        }
        if (!cancelled) setHtml(text);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Yuklab bo'lmadi");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path, bucket]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else wrapRef.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden rounded-lg border bg-card ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""} ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <PresentationIcon className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="truncate font-medium">{title ?? "Prezentatsiya"}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="h-7 gap-1 text-xs"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" /> Chiqish
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" /> To'liq ekran
            </>
          )}
        </Button>
      </div>
      {error ? (
        <div className="grid aspect-video place-items-center p-4 text-center text-sm text-destructive">
          {error}
        </div>
      ) : html === null ? (
        <div className="grid aspect-video place-items-center text-sm text-muted-foreground">
          Yuklanmoqda...
        </div>
      ) : (
        <iframe
          srcDoc={html}
          title={title ?? "Prezentatsiya"}
          className={
            isFullscreen
              ? "h-[calc(100vh-41px)] w-full bg-white"
              : // Phones: a tall box so slides have room (16:9 would be far too
                // short). Tablets/desktop: classic 16:9. Fullscreen for the full view.
                "h-[78vh] min-h-[460px] w-full bg-white sm:aspect-video sm:h-auto sm:max-h-none sm:min-h-0"
          }
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}

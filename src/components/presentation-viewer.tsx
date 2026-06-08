import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Presentation as PresentationIcon } from "lucide-react";
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
export function PresentationSlidesViewer({ slides, title, className, bucket = "presentations" }: Props) {
  const [urls, setUrls] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const key = useMemo(() => slides.join("|"), [slides]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null); setIndex(0);
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
        const resolved = slides.map((s) => (s.startsWith("http") ? s : signedMap[s] ?? null));
        if (!cancelled) setUrls(resolved);
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Xatolik");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [key, bucket]);

  if (!slides.length) {
    return (
      <div className={`grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`}>
        Slaydlar qo'shilmagan
      </div>
    );
  }
  if (loading) return <div className={`grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`}>Yuklanmoqda...</div>;
  if (error) return <div className={`grid aspect-video place-items-center rounded-lg border bg-destructive/10 p-4 text-center text-sm text-destructive ${className ?? ""}`}>{error}</div>;

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
        <span className="text-xs text-muted-foreground">Faqat ko'rish uchun • {index + 1} / {total}</span>
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
          <div className="grid aspect-video w-full place-items-center text-sm text-white/70">Slayd yuklanmadi</div>
        )}
        {total > 1 && (
          <>
            <Button
              type="button" variant="secondary" size="icon"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-90"
              aria-label="Oldingi slayd"
            ><ChevronLeft className="h-5 w-5" /></Button>
            <Button
              type="button" variant="secondary" size="icon"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-90"
              aria-label="Keyingi slayd"
            ><ChevronRight className="h-5 w-5" /></Button>
          </>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, FileText, ExternalLink } from "lucide-react";

type Props = {
  /** Storage path inside the `presentations` bucket, OR a full HTTPS URL */
  url: string;
  type?: string | null;
  name?: string | null;
  title?: string;
  className?: string;
};

export function PresentationViewer({ url, type, name, title, className }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (url.startsWith("http")) {
          if (!cancelled) setSignedUrl(url);
        } else {
          const { data, error } = await supabase.storage
            .from("presentations")
            .createSignedUrl(url, 60 * 60);
          if (error || !data) throw new Error(error?.message ?? "Faylga ruxsat yo'q");
          if (!cancelled) setSignedUrl(data.signedUrl);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? "Xatolik");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [url]);

  const inferredType = (type || name?.split(".").pop() || "").toLowerCase();
  const isPdf = inferredType.includes("pdf");
  const isPptx = inferredType.includes("ppt") || inferredType.includes("presentation");

  if (loading) return <div className={`grid aspect-video place-items-center rounded-lg border bg-muted/30 text-sm text-muted-foreground ${className ?? ""}`}>Yuklanmoqda...</div>;
  if (error || !signedUrl) return <div className={`grid aspect-video place-items-center rounded-lg border bg-destructive/10 p-4 text-center text-sm text-destructive ${className ?? ""}`}>{error ?? "Faylni ochib bo'lmadi"}</div>;

  const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(signedUrl)}`;
  const embedSrc = isPdf ? signedUrl : isPptx ? officeViewer : signedUrl;

  return (
    <div className={`overflow-hidden rounded-lg border bg-card ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
          <span className="truncate font-medium">{title ?? name ?? "Prezentatsiya"}</span>
        </div>
        <div className="flex gap-1">
          <Button asChild size="sm" variant="ghost" className="h-7 px-2">
            <a href={signedUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-7 px-2">
            <a href={signedUrl} download={name ?? undefined}><Download className="h-3.5 w-3.5" /></a>
          </Button>
        </div>
      </div>
      <iframe
        src={embedSrc}
        title={title ?? name ?? "Prezentatsiya"}
        className="block h-[70vh] w-full bg-white"
        loading="lazy"
      />
    </div>
  );
}
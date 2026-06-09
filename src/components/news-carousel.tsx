import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Newspaper, Megaphone, Sparkles, Calendar } from "lucide-react";

const categories: Record<string, { label: string; color: string; icon: any }> = {
  announcement: { label: "E'lon", color: "bg-secondary text-secondary-foreground", icon: Megaphone },
  course: { label: "Yangi kurs", color: "bg-primary text-primary-foreground", icon: Sparkles },
  discount: { label: "Chegirma", color: "bg-warning text-warning-foreground", icon: Sparkles },
  event: { label: "Tadbir", color: "bg-accent text-accent-foreground", icon: Calendar },
};

export function NewsCarousel() {
  const { data: items = [] } = useQuery({
    queryKey: ["public", "news"],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("news")
        .select("*").eq("published", true).order("published_at", { ascending: false }).limit(10);
      if (error) throw error;
      const list = data ?? [];
      await Promise.all(list.map(async (n: any) => {
        if (n.image_url && !n.image_url.startsWith("http")) {
          const { data: s } = await supabase.storage.from("course-covers").createSignedUrl(n.image_url, 3600);
          n._image = s?.signedUrl ?? null;
        } else if (n.image_url) n._image = n.image_url;
      }));
      return list;
    },
  });

  if (!items.length) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-semibold">Yangiliklar</h3>
      </div>
      <Carousel opts={{ align: "start", loop: items.length > 1 }} className="w-full">
        <CarouselContent>
          {items.map((n: any) => {
            const c = categories[n.category] ?? categories.announcement;
            const Icon = c.icon;
            return (
              <CarouselItem key={n.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full overflow-hidden">
                  {n._image ? (
                    <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${n._image})` }} loading="lazy" />
                  ) : (
                    <div className="aspect-[16/9] grid place-items-center bg-gradient-to-br from-primary/10 to-accent/20"><Icon className="h-10 w-10 text-primary/40" /></div>
                  )}
                  <div className="p-4 space-y-2">
                    <Badge className={c.color}><Icon className="mr-1 h-3 w-3" /> {c.label}</Badge>
                    <h4 className="font-display font-semibold leading-snug line-clamp-2">{n.title}</h4>
                    {n.body && <p className="line-clamp-3 text-sm text-muted-foreground">{n.body}</p>}
                    <div className="text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString("uz-UZ")}</div>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {items.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </section>
  );
}
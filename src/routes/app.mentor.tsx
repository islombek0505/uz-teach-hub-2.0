import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Users, BookOpen, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/mentor")({ component: MentorPortal });

function MentorPortal() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["mentor-portal", user?.id],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      const isMentor = (roles ?? []).some((r: any) => r.role === "mentor");
      if (!isMentor) return { isMentor: false, students: [] };

      const { data: subs } = await supabase
        .from("subscriptions")
        .select("user_id, course_id, active, expires_at, courses(title)")
        .eq("mentor_id", user!.id);
      const userIds = Array.from(new Set((subs ?? []).map((s: any) => s.user_id)));
      const profiles = userIds.length
        ? (await supabase
            .from("profiles")
            .select("id, full_name, phone, avatar_url")
            .in("id", userIds)).data ?? []
        : [];
      const pmap = new Map(profiles.map((p: any) => [p.id, p]));
      const students = (subs ?? []).map((s: any) => ({ ...s, profile: pmap.get(s.user_id) }));
      return { isMentor: true, students };
    },
  });

  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Mentor paneli" />
        <main className="p-6 text-muted-foreground">Yuklanmoqda...</main>
      </>
    );
  }

  if (!data.isMentor) {
    return (
      <>
        <Topbar title="Mentor paneli" />
        <main className="p-6">
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Bu sahifa faqat mentorlar uchun.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const active = data.students.filter((s: any) => s.active);
  const courses = new Set(data.students.map((s: any) => s.course_id));

  return (
    <>
      <Topbar title="Mentor paneli" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Faol o'quvchilar</div>
                <div className="font-display text-2xl font-bold">{active.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Kurslar</div>
                <div className="font-display text-2xl font-bold">{courses.size}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl font-semibold">Mening o'quvchilarim</h2>
          {data.students.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                Sizga hali o'quvchi biriktirilmagan
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.students.map((s: any) => (
                <Card key={`${s.user_id}-${s.course_id}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Avatar className="h-10 w-10">
                      {s.profile?.avatar_url ? <AvatarImage src={s.profile.avatar_url} alt={s.profile.full_name ?? ""} /> : null}
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {(s.profile?.full_name || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{s.profile?.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {s.profile?.phone || "—"} • {s.courses?.title || "—"}
                      </div>
                    </div>
                    {s.active ? (
                      <Badge className="bg-success text-success-foreground">Faol</Badge>
                    ) : (
                      <Badge variant="outline">Yopiq</Badge>
                    )}
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        to="/app/courses/$courseId"
                        params={{ courseId: s.course_id }}
                      >
                        Kurs <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
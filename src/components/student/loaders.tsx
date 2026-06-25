// Skeleton loaders for the student panel. They mirror the real layouts so the
// page doesn't jump when data arrives (good UX + good Core Web Vitals / CLS).
// Each block uses the `.shimmer` sweep defined in styles.css over a soft glass
// surface for a premium, "loading but alive" feel.
import { cn } from "@/lib/utils";

/** A single shimmering placeholder bar/box. */
export function Sk({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer rounded-md bg-foreground/[0.06] dark:bg-white/[0.06]", className)}
    />
  );
}

/** Page header placeholder (icon + title + subtitle). */
export function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Sk className="h-11 w-11 rounded-xl" />
      <div className="space-y-2">
        <Sk className="h-6 w-48" />
        <Sk className="h-3.5 w-32" />
      </div>
    </div>
  );
}

/** Topbar-height spacer used while a page mounts (keeps layout stable). */
function Bar() {
  return <div className="h-16 border-b border-white/10" />;
}

/** Dashboard (app.index) skeleton. */
export function DashboardSkeleton() {
  return (
    <>
      <Bar />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <Sk className="h-40 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Sk key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Sk className="h-6 w-40" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Sk key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          </div>
          <Sk className="h-72 rounded-2xl" />
        </div>
      </div>
    </>
  );
}

/** Courses grid (app.courses.index) skeleton. */
export function CoursesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      <Bar />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <HeaderSkeleton />
        <Sk className="h-11 w-full max-w-md rounded-xl" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="glass overflow-hidden rounded-2xl">
              <Sk className="h-40 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Sk className="h-5 w-3/4" />
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-2/3" />
                <Sk className="mt-2 h-9 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Course detail (app.courses.$courseId.index) skeleton. */
export function CourseDetailSkeleton() {
  return (
    <>
      <Bar />
      <div className="flex-1 space-y-6 p-4 lg:p-6">
        <Sk className="aspect-[16/5] w-full rounded-2xl" />
        <Sk className="h-20 w-full rounded-2xl" />
        <div className="space-y-4">
          <Sk className="h-6 w-32" />
          <div className="glass space-y-4 rounded-2xl p-5">
            <div className="flex gap-6">
              <Sk className="h-7 w-24" />
              <Sk className="h-7 w-24" />
              <Sk className="h-7 w-24" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-t border-white/10 pt-4">
                <Sk className="h-9 w-9 rounded-full" />
                <Sk className="h-5 flex-1" />
                <Sk className="h-9 w-9 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** Lesson player (video page) skeleton. */
export function LessonPlayerSkeleton() {
  return (
    <>
      <Bar />
      <div className="flex-1 p-4 lg:p-6">
        <Sk className="mb-4 h-4 w-32" />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <Sk className="aspect-video w-full rounded-2xl" />
            <div className="flex gap-2">
              <Sk className="h-6 w-24 rounded-full" />
              <Sk className="h-6 w-28 rounded-full" />
            </div>
            <Sk className="h-8 w-2/3" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-4/5" />
            <div className="flex gap-2 pt-2">
              <Sk className="h-9 w-24 rounded-lg" />
              <Sk className="h-9 w-28 rounded-lg" />
            </div>
            <Sk className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-3">
            <Sk className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    </>
  );
}

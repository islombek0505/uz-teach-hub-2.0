import { cn } from "@/lib/utils";
import {
  WEEKDAYS,
  GROUP_STATUS,
  GROUP_STATUS_COLOR,
  GROUP_STATUS_ORDER,
  formatScheduleTime,
  type GroupStatus,
} from "@/lib/groups";

export type CalendarGroup = {
  id: string;
  name: string;
  status: GroupStatus;
  schedule_days: number[] | null;
  start_time: string | null;
  end_time: string | null;
  courseTitle?: string;
};

// Haftalik jadval (kalendar) ko'rinishi — guruhlar holat bo'yicha rang bilan
// farqlanadi. Yangi guruh ochishda mavjud jadvalni ko'rish uchun qulay.
export function GroupsCalendar({ groups }: { groups: CalendarGroup[] }) {
  const byDay = new Map<number, CalendarGroup[]>();
  for (const g of groups) {
    for (const d of g.schedule_days ?? []) {
      if (!byDay.has(d)) byDay.set(d, []);
      byDay.get(d)!.push(g);
    }
  }
  for (const [, arr] of byDay) {
    arr.sort((a, b) => (a.start_time ?? "").localeCompare(b.start_time ?? ""));
  }

  return (
    <div className="space-y-3">
      {/* Ranglar izohi */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {GROUP_STATUS_ORDER.filter((s) => s !== "archived").map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", GROUP_STATUS_COLOR[s].dot)} />
            {GROUP_STATUS[s].label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {WEEKDAYS.map((w) => (
          <div key={w.value} className="rounded-lg border bg-muted/20 p-2">
            <div className="mb-2 text-xs font-semibold text-muted-foreground">{w.long}</div>
            <div className="space-y-1.5">
              {(byDay.get(w.value) ?? []).length === 0 && (
                <div className="text-[11px] text-muted-foreground/40">—</div>
              )}
              {(byDay.get(w.value) ?? []).map((g) => (
                <div
                  key={g.id}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-xs",
                    GROUP_STATUS_COLOR[g.status].chip,
                  )}
                  title={g.courseTitle ? `${g.name} · ${g.courseTitle}` : g.name}
                >
                  <div className="font-medium leading-tight">{g.name}</div>
                  <div className="opacity-80">
                    {formatScheduleTime(g.start_time, g.end_time) || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

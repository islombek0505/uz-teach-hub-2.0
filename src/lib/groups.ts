import type { Database } from "@/integrations/supabase/types";

export type GroupStatus = Database["public"]["Enums"]["group_status"];
export type MembershipStatus = Database["public"]["Enums"]["membership_status"];

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

// ISO hafta kunlari: 1 = Dushanba ... 7 = Yakshanba
export const WEEKDAYS: { value: number; short: string; long: string }[] = [
  { value: 1, short: "Du", long: "Dushanba" },
  { value: 2, short: "Se", long: "Seshanba" },
  { value: 3, short: "Ch", long: "Chorshanba" },
  { value: 4, short: "Pa", long: "Payshanba" },
  { value: 5, short: "Ju", long: "Juma" },
  { value: 6, short: "Sh", long: "Shanba" },
  { value: 7, short: "Ya", long: "Yakshanba" },
];

export const GROUP_STATUS: Record<GroupStatus, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Qoralama", variant: "outline" },
  recruiting: { label: "Qabul ochiq", variant: "default" },
  active: { label: "Darslar ketmoqda", variant: "secondary" },
  completed: { label: "Yakunlangan", variant: "outline" },
  archived: { label: "Arxiv", variant: "outline" },
};

export const GROUP_STATUS_ORDER: GroupStatus[] = [
  "draft",
  "recruiting",
  "active",
  "completed",
  "archived",
];

export const MEMBERSHIP_STATUS: Record<MembershipStatus, { label: string; variant: BadgeVariant }> =
  {
    pending: { label: "Kutilmoqda", variant: "outline" },
    approved: { label: "A'zo", variant: "default" },
    rejected: { label: "Rad etilgan", variant: "destructive" },
    cancelled: { label: "Bekor qilingan", variant: "outline" },
  };

export function formatPrice(amount: number | null | undefined): string {
  const n = Number(amount ?? 0);
  return n > 0 ? `${n.toLocaleString("ru-RU")} so'm` : "Bepul";
}

export function pricePeriodLabel(period: string | null | undefined): string {
  return period === "course" ? "kurs uchun" : "oyiga";
}

/** "18:00:00" -> "18:00" */
function trimSeconds(t: string | null | undefined): string {
  if (!t) return "";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export function formatScheduleDays(days: number[] | null | undefined): string {
  const list = (days ?? [])
    .slice()
    .sort((a, b) => a - b)
    .map((d) => WEEKDAYS.find((w) => w.value === d)?.short ?? "")
    .filter(Boolean);
  return list.join(", ");
}

export function formatScheduleTime(start?: string | null, end?: string | null): string {
  const s = trimSeconds(start);
  if (!s) return "";
  const e = trimSeconds(end);
  return e ? `${s}–${e}` : s;
}

export function formatSchedule(
  days: number[] | null | undefined,
  start?: string | null,
  end?: string | null,
): string {
  const parts = [formatScheduleDays(days), formatScheduleTime(start, end)].filter(Boolean);
  return parts.join(" · ") || "—";
}

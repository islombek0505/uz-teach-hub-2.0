import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Add a whole number of calendar months to a date — calendar-accurate, so the
 * result lands on the same day-of-month N months later regardless of how many
 * days those months actually have. Handles end-of-month overflow: e.g.
 * Jan 31 + 1 month → Feb 28/29 (not Mar 3), and 3 months from June 27 lands on
 * Sep 27, whether that span is 89, 90, 91 or 92 days.
 */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // If the day rolled into the next month (e.g. Jan 31 → Mar 3), clamp back to
  // the last day of the intended month.
  if (d.getDate() < day) d.setDate(0);
  return d;
}

/**
 * Human-readable length of a plan, preferring calendar months when available
 * and falling back to the legacy day count. e.g. "1 oy", "3 oy", "1 yil",
 * "18 oy", or "45 kun".
 */
export function planDurationLabel(plan: {
  duration_months?: number | null;
  duration_days?: number | null;
}): string {
  const m = plan.duration_months ?? null;
  if (m && m > 0) {
    if (m % 12 === 0) {
      const years = m / 12;
      return `${years} yil`;
    }
    return `${m} oy`;
  }
  const d = plan.duration_days ?? 0;
  return `${d} kun`;
}

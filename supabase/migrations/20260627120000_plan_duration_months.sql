-- =====================================================================
-- Calendar-accurate plan durations
-- =====================================================================
-- Plans previously stored only `duration_days` (a fixed day count), so a
-- "3 oylik" plan was always exactly 90 days. Real calendar months are
-- 28-31 days, so 3 months from a given date can be 89-92 days. This adds a
-- `duration_months` column that, when set, drives expiry by adding that many
-- *calendar* months at activation time (see src/routes/admin.payments.tsx and
-- addMonths() in src/lib/utils.ts). `duration_days` is kept as a nominal
-- fallback for any legacy plan whose duration_months is null.
-- ---------------------------------------------------------------------

alter table public.plans
  add column if not exists duration_months integer
  check (duration_months is null or duration_months > 0);

comment on column public.plans.duration_months is
  'Subscription length in whole calendar months. When set, activation computes expires_at by adding this many calendar months to the start date (calendar-accurate). Falls back to duration_days when null.';

-- Backfill every existing plan with its nearest whole-month equivalent.
update public.plans
   set duration_months = greatest(1, round(duration_days / 30.0))
 where duration_months is null;

-- ---------------------------------------------------------------------
-- Normalise the standard tariffs to a consistent code/title/description and
-- exact month length. Existing rows are matched by their current code
-- (m3/m6/y1). Prices are intentionally left untouched here so the values you
-- set in the admin panel are preserved.
-- ---------------------------------------------------------------------
update public.plans set
  code = '3m',
  title = '3 oylik obuna',
  description = '3 oy davomida barcha kurslar va video darslarga to''liq ruxsat.',
  duration_months = 3,
  duration_days = 90,
  sort_order = 2
where code = 'm3';

update public.plans set
  code = '6m',
  title = '6 oylik obuna',
  description = '6 oy davomida barcha kurslar va video darslarga to''liq ruxsat.',
  duration_months = 6,
  duration_days = 180,
  sort_order = 3
where code = 'm6';

update public.plans set
  code = '12m',
  title = '1 yillik obuna',
  description = '1 yil davomida barcha kurslar va video darslarga to''liq ruxsat.',
  duration_months = 12,
  duration_days = 365,
  sort_order = 4
where code = 'y1';

-- Add the missing 1-month plan. NOTE: 99000 is a PLACEHOLDER price — change it
-- to your real 1-month price (or edit it later in the admin panel). Re-running
-- this migration updates everything except the price, so a price you set in the
-- panel is never overwritten.
insert into public.plans (code, title, description, duration_months, duration_days, price, sort_order, is_active)
values (
  '1m',
  '1 oylik obuna',
  '1 oy davomida barcha kurslar va video darslarga to''liq ruxsat.',
  1,
  30,
  99000,            -- <-- PLACEHOLDER: 1 oylik narx
  1,
  true
)
on conflict (code) do update set
  title = excluded.title,
  description = excluded.description,
  duration_months = excluded.duration_months,
  duration_days = excluded.duration_days,
  sort_order = excluded.sort_order;

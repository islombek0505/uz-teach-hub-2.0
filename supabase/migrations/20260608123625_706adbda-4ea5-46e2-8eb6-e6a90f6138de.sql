ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS price_self numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_mentor numeric(12,2) NOT NULL DEFAULT 0;

UPDATE public.courses SET price_self = price WHERE price_self = 0 AND price > 0;
UPDATE public.courses SET price_mentor = price WHERE price_mentor = 0 AND price > 0;
-- =====================================================================
-- Security hardening
-- =====================================================================
-- Closes three issues found in a security review:
--   1. Users could grant themselves unlimited free access by inserting a
--      user_plan row with is_trial=true and an arbitrary far-future expires_at.
--   2. Enrolled users could read quiz_questions.correct_index directly,
--      exposing the answer key.
--   3. platform_settings was readable by every authenticated user.
--
-- Trial activation and quiz question delivery now go exclusively through
-- server functions that use the service-role key (which bypasses RLS).

-- 1. Remove the client-side trial insert path. Trials are now created by the
--    `activateTrial` server function (service role), which sets a controlled
--    7-day expiry and enforces one-trial-per-user.
DROP POLICY IF EXISTS "Users insert own trial" ON public.user_plan;

-- 2. Stop students from reading quiz answers directly. Admins keep full access
--    via "Admins manage quiz questions"; students receive questions (without
--    correct_index) through the `getQuizQuestions` server function.
DROP POLICY IF EXISTS "Enrolled users read quiz questions" ON public.quiz_questions;

-- 3. Restrict platform settings to admins only (no app code reads them as a
--    non-admin). Admins retain access through "Admins manage settings".
DROP POLICY IF EXISTS "Auth can read settings" ON public.platform_settings;


-- Payment cards (admin can add multiple cards, show/hide individually)
CREATE TABLE public.payment_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  card_number text NOT NULL,
  holder_name text NOT NULL,
  bank text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_cards TO authenticated;
GRANT ALL ON public.payment_cards TO service_role;
ALTER TABLE public.payment_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can read active cards" ON public.payment_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage cards" ON public.payment_cards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_payment_cards_updated BEFORE UPDATE ON public.payment_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact channels (telegram, phone, instagram, whatsapp, email, website)
CREATE TABLE public.contact_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('telegram','phone','instagram','whatsapp','email','website','youtube','facebook')),
  label text NOT NULL,
  value text NOT NULL,
  url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_channels TO authenticated;
GRANT ALL ON public.contact_channels TO service_role;
ALTER TABLE public.contact_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can read channels" ON public.contact_channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage channels" ON public.contact_channels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_contact_channels_updated BEFORE UPDATE ON public.contact_channels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Platform settings (singleton key/value store)
CREATE TABLE public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can read settings" ON public.platform_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_platform_settings_updated BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed defaults from previous hard-coded values
INSERT INTO public.platform_settings (key, value) VALUES
  ('platform', '{"name":"LearnHub","tagline":"Online ta''lim platformasi"}'::jsonb),
  ('system', '{"allow_registration":true,"sms_verification":true,"block_video_download":true,"auto_expire_subscriptions":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.payment_cards (label, card_number, holder_name, bank, sort_order)
VALUES ('Asosiy karta', '8600 1234 5678 9012', 'Yusupov A.K.', 'Humo / Uzcard', 0);

INSERT INTO public.contact_channels (type, label, value, url, sort_order) VALUES
  ('phone','Telefon','+998 90 123 45 67','tel:+998901234567',0),
  ('telegram','Telegram','@learnhub_uz','https://t.me/learnhub_uz',1);

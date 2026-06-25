# Deploy — Vercel

Bu loyiha `uz-teach-hub.2.0` repozitoriysining **`uz-teach-hub-next/`** ichki papkasida.
Shu sababli Vercel'da **Root Directory** ni shu papkaga sozlash muhim.

## 1. Reponi Vercel'ga ulash

1. [vercel.com](https://vercel.com) → **Add New → Project** → repozitoriyni import qiling.
2. **Root Directory** → `uz-teach-hub-next` ni tanlang.
3. Framework: **Next.js** (avtomatik aniqlanadi). Build buyrug'i va chiqish papkasi standart.

## 2. Environment Variables

Vercel → Project → **Settings → Environment Variables** (Production + Preview):

| Nomi | Qiymat |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://onlinetalim.uz` (yoki Vercel domeningiz) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase loyiha URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable (anon) kalit |
| `SUPABASE_SERVICE_ROLE_KEY` | (ixtiyoriy) server amallari uchun |

> Eski ilova ishlatayotgan **xuddi o'sha** Supabase loyihasini ko'rsating — ma'lumotlar joyida qoladi.

## 3. Supabase sozlamalari

Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://onlinetalim.uz`
- **Redirect URLs** ro'yxatiga qo'shing: `https://onlinetalim.uz/**` va Vercel preview domeni (`https://*.vercel.app/**`).

## 4. Domen

Vercel → **Settings → Domains** → `onlinetalim.uz` qo'shing va DNS'ni ko'rsatilgan yozuvlarga moslang
(A/CNAME). `NEXT_PUBLIC_SITE_URL` ni shu domenga tenglashtiring (sitemap/canonical/OG shunga bog'liq).

## 5. Deploy

`main` branchga push qilsangiz Vercel avtomatik build + deploy qiladi.
Har bir PR uchun preview URL beriladi.

## Deploydan keyingi tekshiruv

- [ ] `https://DOMAIN/` ochiladi, landing ko'rinadi (SSR).
- [ ] `/sitemap.xml` va `/robots.txt` to'g'ri qaytadi.
- [ ] `/manifest.webmanifest` ishlaydi (PWA), ikonlar yuklanadi.
- [ ] OG preview: linkni Telegram/Twitter'ga tashlab tekshiring (`/og-image.png`).
- [ ] Kirish/ro'yxatdan o'tish ishlaydi; `/admin` va `/app` sessiyasiz `/auth/login`ga yo'naltiradi.
- [ ] Lighthouse: Performance / SEO / Best-Practices ≥ 90.
- [ ] Brauzer konsolida CSP buzilishi yo'q (agar bo'lsa — `next.config.ts` dagi CSP'ga origin qo'shing).

## Xavfsizlik header'lari

Barcha header'lar (CSP, HSTS, X-Frame-Options, Permissions-Policy, ...) `next.config.ts`
ichida — platformadan mustaqil, Vercel'da avtomatik qo'llanadi.

## Eslatma — eski ilova

Eski TanStack/Netlify ilovasi (`../`) tegilmagan. Yangi domenga o'tgach, eski Netlify
deploy'ini o'chirib, DNS'ni Vercel'ga qaratishingiz mumkin.

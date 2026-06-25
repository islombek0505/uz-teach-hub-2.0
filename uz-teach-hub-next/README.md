# UzTeachHub — Next.js (2.0)

`uz-teach-hub` ning `clone-app1` uslubidagi qayta yozilgan, tartibli versiyasi.
Stack: **Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Zustand · Supabase · react-hook-form · zod · sonner**.

> Eski TanStack Start ilovasi (`../src`) **o'zgartirilmagan** — u ishlashda davom etadi.
> Bu yangi loyiha alohida papkada, xavfsiz tarzda quriladi. Tayyor bo'lganda almashtirasiz.

## Ishga tushirish

```bash
cd uz-teach-hub-next
cp .env.local.example .env.local   # Supabase ma'lumotlarini to'ldiring
npm install
npm run dev
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<loyiha>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-anon-key>
```

Bu **xuddi eski ilova ishlatayotgan** Supabase loyihasi — barcha ma'lumotlar joyida qoladi.

## Sahifalar

- **Auth**: `/auth/login`, `/auth/register`
- **Admin**: `/admin` (dashboard), `/admin/courses` (+ `[courseId]` muharrir), `/admin/students`,
  `/admin/student-stats`, `/admin/plans`, `/admin/payments`, `/admin/news`, `/admin/feedback`,
  `/admin/notifications`, `/admin/settings`, `/admin/profile`
- **O'quvchi**: `/app`, `/app/courses` (+ `[courseId]`, dars ko'ruvchi), `/app/subscription`,
  `/app/feedback`, `/app/notifications`, `/app/profile`

## Arxitektura

Batafsil — `ARCHITECTURE.md`. Qisqacha: generic store-factory (1 qatorli store'lar), creator
komponentlar, Presenter pattern, markazlashgan types/validation/constants.

## Tekshiruv holati

Kod TypeScript bo'yicha to'liq tekshirildi (React, Supabase, Zod, react-hook-form tiplari bilan):
**0 ta xato**. `npm install` registry ochilgach to'liq `next build` ishlatish mumkin.

## Hali qo'lda ulanishi mumkin bo'lgan ilg'or funksiyalar

Quyidagilar arxitekturaga mos joylashtirilgan, lekin sizning xizmatlaringizga bog'liq
(env/kalitlar kerak): **Bunny** video yuklash (`createBunnyVideo`), taqdimot slaydlari yuklash,
kviz muharririning to'liq oqimi, telefon-OTP tasdiqlash (`telegram-verify-service`).
Dars ko'ruvchi Bunny video va slaydlarni allaqachon ko'rsatadi; yuklash oqimini keyin ulaymiz.

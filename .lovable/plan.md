## Maqsad

Platformani kurs-bo'yicha to'lovdan **umumiy tariff (oylik obuna)** modeliga o'tkazish, mentor funksiyasini butunlay olib tashlash, va admindan tashqari hamma foydalanuvchilarni o'chirish. Yangi foydalanuvchilarga 1 haftalik bepul sinov beriladi (o'zi aktivlashtiradi).

---

## 1. Ma'lumotlar bazasi o'zgarishlari (migration)

**Yangi tushunchalar:**
- `plans` jadvali — tariff rejalar ro'yxati (3 oy, 6 oy, 12 oy). Maydonlar: `code`, `title`, `duration_days`, `price`, `is_active`, `sort_order`.
- `user_plan` jadvali (yoki `profiles` ga ustunlar) — har bir userning faol tariffi: `plan_id`, `started_at`, `expires_at`, `is_trial`.
- `profiles.trial_activated_at` — sinov muddat aktivlashtirilgan sana (NULL bo'lsa hali aktivlashtirilmagan, faqat 1 marta bo'lishi mumkin).
- `payments` jadvaliga `plan_id` ustun (course_id endi NULL bo'lishi mumkin).
- SQL funksiya: `has_active_plan(_user_id uuid) returns boolean` — `user_plan` faol va `expires_at > now()` bo'lsa true.
- `has_course_access` funksiyani **`has_active_plan` ga moslab yangilash** (admin yoki active plan = access).

**Mentorlikni olib tashlash:**
- `mentor_courses` jadvalini DROP.
- `profiles` dagi mentor bilan bog'liq ustunlar (`is_mentor`, `mentor_approved`, va h.k.) bo'lsa DROP.
- `courses.price_mentor` va `courses.price_self`, `courses.price` ustunlarini DROP (kurs darajasidagi narx endi yo'q).
- `subscriptions` jadvali endi keraksiz — uni DROP qilamiz (kursga obuna emas, umumiy tariff).

**Foydalanuvchilarni tozalash:**
- Admindan tashqari barcha `auth.users`, `profiles`, `user_roles`, `lesson_progress`, `subscriptions`, `payments`, `feedback`, `notifications`, `quiz_attempts`, `notification_reads` ma'lumotlarini o'chirish.
- Admin = `998501882945` raqamiga ega user. CASCADE ishonchli bo'lsin.

**Default tariff data:**
- `plans` ga 3 oylik, 6 oylik, yillik standart rejalar insert qilinadi (narx adminda tahrirlanadi).

---

## 2. Frontend o'zgarishlari

### Olib tashlanadi
- `src/routes/app.mentor.tsx` — to'liq olib tashlanadi.
- `src/routes/admin.mentors.tsx` — to'liq olib tashlanadi.
- `student-sidebar.tsx` va `admin-sidebar.tsx` dagi "Mentor paneli" / "Mentorlar" itemlari.
- `app.profile.tsx` dagi mentor form qismi.
- `app.courses.index.tsx`, `app.courses.$courseId.index.tsx`, `admin.courses.*` dagi `price_self` / `price_mentor` / `price` ko'rinishlari.
- Kurs sotib olish CTA — o'rniga "Tariff sotib olish" / "Sinovni boshlash".

### Yangilanadi
- **`/app/subscription`** sahifasi to'liq qayta yoziladi: tariff rejalar ro'yxati, faol tariff statusi, sinov tugmasi, to'lov kartalari, to'lov tarixi.
- **`AuthGate` / yangi `usePlanAccess` hook** — video ko'rish (lesson page) faol tarifsiz blok qilinadi: "Akkountingiz aktiv emas, tariff sotib oling" + tugma.
- **`app.courses.$courseId.lessons.$lessonId.tsx`** — `has_active_plan` tekshiruvi qo'shiladi; aks holda video o'rniga lock card.
- **`app.index.tsx` dashboard** — sinov/tariff statusi banner sifatida ko'rsatiladi. Sinov hali aktivlashtirilmagan bo'lsa "1 haftalik bepul sinovni boshlash" tugmasi.
- **Admin: `/admin/plans`** yangi sahifa — rejalarni CRUD qilish (narx, davomiylik, faollik).
- **Admin: `/admin/payments`** — endi tariff to'lovlari uchun. Tasdiqlanganda `user_plan` ga insert/update bo'ladi (`expires_at = now() + duration_days`).
- **Admin sidebar** — "Mentorlar" o'rniga "Tariffalar".

### Sinov logikasi
- `profiles.trial_activated_at IS NULL` bo'lsa — "Sinovni boshlash" tugmasi.
- Bosgansa: `trial_activated_at = now()`, `user_plan` ga `is_trial=true`, `expires_at = now() + 7 days` insert.
- Tugagandan keyin qayta sinov yo'q.

---

## 3. Server function

- `activateTrial` server fn (`requireSupabaseAuth`) — sinov bir martagina.
- `getMyPlanStatus` server fn — joriy tariff/sinov holatini qaytaradi.
- Admin: `approvePlanPayment` — to'lov tasdiqlanganda `user_plan` ni yangilaydi.

---

## 4. Texnik detallar

- Migration tartibi: foreign key tutib qolmasligi uchun avval DROP, keyin CREATE.
- Foydalanuvchilarni o'chirish `auth.users` dan CASCADE orqali boradi (profiles, user_roles, lesson_progress va h.k. `ON DELETE CASCADE` bo'lishi shart — kerak bo'lsa migration ichida moslanadi).
- RLS: `plans` — anon SELECT (faollar), authenticated SELECT; admin yozadi. `user_plan` — user o'zinikini SELECT, admin hammasini boshqaradi, trial uchun INSERT auth.uid()=user_id.

---

## Faylar (taxminiy)

**Migration**
- `supabase/migrations/..._tariff_system.sql`

**Yangi**
- `src/routes/admin.plans.tsx`
- `src/lib/plans.functions.ts`
- `src/components/plan-required-gate.tsx`

**Yangilanadi**
- `src/routes/app.subscription.tsx`, `app.index.tsx`, `app.profile.tsx`, `app.courses.index.tsx`, `app.courses.$courseId.index.tsx`, `app.courses.$courseId.lessons.$lessonId.tsx`
- `src/routes/admin.courses.*`, `admin.payments.tsx`, `admin.index.tsx`
- `src/components/admin-sidebar.tsx`, `student-sidebar.tsx`
- `src/components/auth-gate.tsx` (yoki yangi gate)

**O'chiriladi**
- `src/routes/app.mentor.tsx`
- `src/routes/admin.mentors.tsx`

---

## Tasdiqlashingiz kerak savollar

1. **Default tariff narxlari** — qancha bo'lsin? (men 3 oy = 290 000, 6 oy = 540 000, 12 oy = 990 000 so'm placeholder qo'yaman, adminda o'zgartirasiz.)
2. **Admin telefon raqami** — `998501882945` admin. To'g'rimi? Boshqa adminlar bormi?
3. Tasdiqlasangiz amalga oshiraman.

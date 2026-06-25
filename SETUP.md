# uz-teach-hub — mustaqil o'rnatish (Lovable'siz)

Bu qo'llanma loyihani **o'zingizning Supabase loyihangizда**, Lovable nazoratisiz ishga tushirishni ko'rsatadi. Ma'lumotlarni (kurslar, darslar, materiallar) **o'zingiz qo'lda** admin panel orqali kiritasiz — bu yerda faqat bo'sh, lekin to'liq ishlaydigan tizimni quramiz.

Loyiha kodi allaqachon Lovable'dan ajratilgan (standart TanStack Start + Supabase). Qoladigan yagona narsa — backend (Supabase) sizniki bo'lishi.

---

## 1-qadam — O'z Supabase loyihangizni yarating

1. [supabase.com/dashboard](https://supabase.com/dashboard) ga **o'z akkountingiz** bilan kiring.
2. **New project** → nom, kuchli DB paroli, region (Yevropa yaqin) tanlang → yarating.
3. 1-2 daqiqa kuting (provision bo'ladi).

## 2-qadam — Sxemani qUring (bitta SQL fayl)

1. Yangi loyihada: **SQL Editor → New query**.
2. `supabase/_setup/full-schema.sql` faylini to'liq oching, hammasini nusxalang, SQL Editor'ga joylang va **Run** bosing.
3. "Success" chiqishi kerak. Bu hamma narsani quradi: jadvallar, RLS siyosatlari, funksiyalar, triggerlar, standart tariflar va **5 ta storage bucket** (`avatars`, `course-covers`, `materials`, `receipts`, `presentations`).

> Muqobil (ixtiyoriy, Supabase CLI bilan): `supabase login` → `supabase link --project-ref YANGI_REF` → `supabase db push`. Bu `supabase/migrations/` dagi migratsiyalarni qo'llaydi. So'ng bucket'larни yaratish uchun `full-schema.sql` oxiridagi `insert into storage.buckets ...` qismini SQL Editor'da ishga tushiring.

## 3-qadam — Auth sozlamalari

App telefon+parol bilan ishlaydi (email = `<raqam>@platform.local`, ro'yxatdan o'tgach avtomatik kiradi). Shuning uchun **email tasdiqlash o'chirilishi** kerak:

1. **Authentication → Sign In / Providers → Email**.
2. **Confirm email** ni **OFF** qiling (saqlang). Email provayder yoniq bo'lsin.

## 4-qadam — Kalitlarni `.env`ga yozing

Supabase'da: **Project Settings → API**. Quyidagilarni `.env`ga ko'chiring (eski Lovable qiymatlari o'rniga):

```
SUPABASE_URL="https://YANGI_REF.supabase.co"
VITE_SUPABASE_URL="https://YANGI_REF.supabase.co"
SUPABASE_PROJECT_ID="YANGI_REF"
VITE_SUPABASE_PROJECT_ID="YANGI_REF"

# "anon / public" kaliti:
SUPABASE_PUBLISHABLE_KEY="eyJ..."
VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."

# "service_role" maxfiy kaliti (faqat server, hech qachon VITE_ prefiksisiz):
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

Bunny (video) va Verify (Telegram) o'zgaruvchilarini avvalgidek qoldiring (ular alohida xizmatlar).

## 5-qadam — Lokal ishga tushiring va admin yarating

```bash
rm -rf node_modules && npm install
npm run dev          # http://localhost:8080
```

1. `/auth/register` → telefon **+998 50 188 2945** bilan ro'yxatdan o'ting → bu raqam **avtomatik admin** bo'ladi (DB trigger shunday sozlangan).
2. Boshqa raqamni admin qilmoqchi bo'lsangiz: avval shu raqam bilan ro'yxatdan o'ting, so'ng `supabase/_setup/make-admin.sql` faylidagi raqamni o'zgartirib, SQL Editor'da ishga tushiring.

## 6-qadam — Productionga deploy (Netlify)

`netlify.toml` allaqachon tayyor. Netlify'da repo'ni ulang va **Site settings → Environment variables** ga 4-qadamdagi BARCHA o'zgaruvchilarni qo'shing (`SUPABASE_*`, `VITE_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `BUNNY_*`, `VERIFY_*`). Build buyrug'i: `npm run build`.

## 7-qadam — Kontentni qo'lda kiriting

Admin sifatida kiring → **Kurslar → Yangi kurs** → modul, dars, video/HTML prezentatsiya, material, test savollarini qo'shing. Tariflar standart bo'lib keladi (3/6/12 oylik) — **Tariflar** bo'limida o'zgartirishingiz mumkin.

## 8-qadam — Lovable'ni chetlatish

Yangi loyihada hammasi ishlayotganini tasdiqlagach, Lovable loyihasini bemalol o'chirib tashlashingiz yoki tark etishingiz mumkin — ilova endi unга bog'liq emas. (Eski Supabase loyihasini ham o'chirishingiz mumkin, lekin yangi loyiha to'liq ishlayotganiga ishonch hosil qilгач.)

---

## Eslatmalar / muammolar

- **"column ... does not exist"** — `full-schema.sql` to'liq ishga tushmagan. SQL Editor'da qaytadan, to'liq joylab ishga tushiring.
- **Rasm/video/prezentatsiya ko'rinmaydi** — bucket'lar yaratilmagan. `full-schema.sql` oxiridagi `insert into storage.buckets` qismi ishga tushganini tekshiring (**Storage** bo'limida 5 ta bucket ko'rinishi kerak).
- **Ro'yxatdan o'tib bo'lmaydi** — 3-qadam (Confirm email = OFF) bajarilmagan.
- **Admin paneliga kira olmadim** — raqamingiz admin emas; `make-admin.sql` ni ishlating yoki +998501882945 bilan ro'yxatdan o'ting.
- Hammasi git'da — biror narsa noto'g'ri ketsa, ortga qaytarish oson.

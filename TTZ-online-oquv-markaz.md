# TTZ — Online o'quv markaz modeliga o'tish (batafsil texnik reja)

> **Maqsad:** mavjud platformani (kurslar + tarif/obuna modeli) **ananaviy o'quv markazning online ko'rinishiga** o'tkazish — **guruhlar**, guruhga **qabul**, guruh ichidagi **darsliklar**, va guruhga mos **to'lov** asosida.
>
> **Bu hujjat — reja.** Kod yozishdan oldin tasdiqlash uchun. Tasdiqlangach, bosqichma-bosqich quramiz.
>
> **Qaror qilingan asoslar (sizdan):**
> 1. Avval **batafsil reja** (shu hujjat).
> 2. DB o'zgarishlari **jonli Supabase**'ga qo'llanadi (ijro bosqichida).
> 3. Darsliklarga **kirish faqat admin tasdiqlagan a'zolikka** bog'liq. To'lov alohida kuzatiladi/ko'rsatiladi, lekin kirishni **bloklamaydi** (ananaviy o'quv markaz kabi).

---

## 1. Hozirgi holat (qisqacha audit)

- **Stack:** TanStack Start (React 19) + Supabase (Postgres, RLS) + server functions (service-role, `createServerFn`). Netlify deploy.
- **Kontent modeli:** `courses` → `modules` → `lessons` (+ `lesson_materials`, `quiz_questions`, `course_presentations`). Dars turlari: video (Bunny), prezentatsiya (slayd/HTML), matn.
- **Kirish modeli (hozir):** `plans` (3/6/12 oylik tariflar) + `user_plan` (bitta faol tarif) → `has_active_plan()` → bitta faol tarif = **barcha** kurslarga ruxsat. Eski per-course `subscriptions` jadvali allaqachon o'chirilgan.
- **To'lov:** `payments` (chek yuklash, admin tasdiq/rad, avto-bildirishnoma triggerlari), tarif (`plan_id`) ga bog'langan.
- **Bildirishnoma:** `notifications` — `user_id = NULL` → hammaga (broadcast), aks holda bitta foydalanuvchiga. **Guruhga yo'naltirish yo'q.**
- **Rollar:** `admin` / `student` (admin = telefon `998501882945`).

### O'zgarishning mohiyati (eski → yangi)

| Tushuncha | Hozir | Yangi (o'quv markaz) |
|---|---|---|
| Kontent egasi | Kurs (hammaga ochiq, tarif bilan) | **Guruh** (faqat shu guruh a'zolariga) |
| Kirish huquqi | Faol **tarif** (barcha kurslar) | Admin tasdiqlagan **guruh a'zoligi** |
| Yozilish | Tarif sotib olish | Guruhga **qo'shilish so'rovi** → admin tasdig'i |
| To'lov | Tarif narxi | **Guruh narxi** |
| Kurs | Asosiy birlik | **Yo'nalish** (Frontend, Ingliz tili...) — guruhlar shu yo'nalish ostida |

> **Asosiy model qarori:** `courses` = **yo'nalish** sifatida saqlanadi. `groups` = shu yo'nalish ostidagi **oqim/guruh** (masalan "2-Frontend", "4-Frontend"). Darsliklar **guruh ichida** yaratiladi va faqat shu guruh a'zolariga ko'rinadi. Shuning uchun "2-Frontend" guruhi "4-Frontend" darsliklarini ko'ra olmaydi.

---

## 2. Ma'lumotlar bazasi (DB) o'zgarishlari

Hammasi **bitta yangi migration** sifatida yoziladi (`supabase/migrations/2026XXXX_groups_model.sql`), `full-schema.sql` va `src/integrations/supabase/types.ts` yangilanadi.

### 2.1 Yangi ENUM'lar

```sql
-- Guruh holati
CREATE TYPE public.group_status AS ENUM (
  'draft',       -- admin yaratyapti, hali e'lon qilinmagan
  'recruiting',  -- qabul ochiq (o'quvchilar so'rov yubora oladi)
  'active',      -- darslar boshlangan (qabul yopiq, guruh ko'rinishda qoladi)
  'completed',   -- guruh yakunlangan
  'archived'     -- arxiv
);

-- A'zolik / qo'shilish so'rovi holati
CREATE TYPE public.membership_status AS ENUM (
  'pending',     -- so'rov yuborilgan (admin tasdig'ini kutmoqda)
  'approved',    -- tasdiqlangan (a'zo)
  'rejected',    -- admin rad etgan
  'cancelled'    -- o'quvchi o'zi bekor qilgan / chiqib ketgan
);
```

### 2.2 Yangi jadval: `groups`

```sql
CREATE TABLE public.groups (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT, -- yo'nalish
  name          text NOT NULL,                 -- "2-Frontend"
  description   text,
  status        public.group_status NOT NULL DEFAULT 'draft',

  -- Sig'im (diapazon ham mumkin)
  capacity      int NOT NULL DEFAULT 25,        -- maksimal o'quvchi
  min_capacity  int,                            -- minimal (diapazon uchun, ixtiyoriy)

  -- Narx
  price         numeric(12,2) NOT NULL DEFAULT 0,
  price_period  text NOT NULL DEFAULT 'monthly', -- 'monthly' | 'course'

  -- Jadval
  schedule_days smallint[] NOT NULL DEFAULT '{}', -- ISO kunlar: 1=Dush ... 7=Yak
  start_time    time,                            -- "18:00"
  end_time      time,                            -- "19:30"
  starts_on     date,                            -- darslar boshlanish sanasi
  duration_weeks int,                            -- davomiyligi (ixtiyoriy)

  telegram_link text,                            -- yopiq telegram guruh havolasi
  cover_url     text,

  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_groups_course ON public.groups(course_id);
CREATE INDEX idx_groups_status ON public.groups(status);
```

### 2.3 Yangi jadval: `group_members` (a'zolik + qo'shilish so'rovlari)

So'rov va a'zolik **bitta jadvalda** (lifecycle `status` orqali). Bitta o'quvchi + bitta guruh = bitta qator (qayta so'rov yuborsa, status `pending`'ga qaytadi).

```sql
CREATE TABLE public.group_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id     uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       public.membership_status NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at   timestamptz,
  decided_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);
CREATE INDEX idx_group_members_group ON public.group_members(group_id, status);
CREATE INDEX idx_group_members_user  ON public.group_members(user_id, status);
```

**Sig'im qoidasi:** seat (o'rin) faqat **`approved`** a'zolar bilan to'ladi. `pending` so'rovlar o'rinni egallamaydi (admin tasdiqlaganda tekshiriladi). Bu sizning talabingizga mos: *"admin guruh o'quvchilar soni to'lmagan bo'lsa qabul qiladi"*.

### 2.4 O'zgartiriladigan jadvallar

**`modules`** — kontent endi guruh ichida:
```sql
ALTER TABLE public.modules
  ADD COLUMN group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.modules ALTER COLUMN course_id DROP NOT NULL; -- legacy uchun
CREATE INDEX idx_modules_group ON public.modules(group_id);
```

**`lessons`** — RLS tezligi uchun `group_id` denormalizatsiya:
```sql
ALTER TABLE public.lessons
  ADD COLUMN group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.lessons ALTER COLUMN course_id DROP NOT NULL;
CREATE INDEX idx_lessons_group ON public.lessons(group_id);
```

**`payments`** — guruhga bog'lash + **oylik davr** (har oyga alohida to'lov):
```sql
ALTER TABLE public.payments
  ADD COLUMN group_id     uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  ADD COLUMN period_month date;   -- to'lov qaysi oy uchun (oyning 1-sanasi, masalan 2026-07-01)
CREATE INDEX idx_payments_group ON public.payments(group_id);
-- Bitta o'quvchi + guruh + oy uchun bitta faol to'lov (qayta yuborishda yangilanadi)
CREATE UNIQUE INDEX uq_payment_period ON public.payments(user_id, group_id, period_month)
  WHERE group_id IS NOT NULL AND status <> 'rejected';
-- plan_id ustuni saqlanadi (eski yozuvlar uchun), lekin yangi oqimda ishlatilmaydi
```
> **Oylik to'lov modeli (tasdiqlangan):** har bir `approved` a'zo har oy uchun guruh `price` summasini to'laydi. O'quvchi bir nechta guruhda bo'lsa, har bir guruh uchun alohida oylik to'lov chiqadi. `period_month` qaysi oy uchun ekanini belgilaydi.

**`notifications`** — guruhga yo'naltirish:
```sql
ALTER TABLE public.notifications
  ADD COLUMN group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
CREATE INDEX idx_notifications_group ON public.notifications(group_id) WHERE group_id IS NOT NULL;
```

**`lesson_progress`** — (ixtiyoriy) `group_id` qo'shish, statistikani guruh bo'yicha hisoblash uchun. `lesson_id`'dan ham aniqlash mumkin, shuning uchun bu **ixtiyoriy**.

### 2.5 Helper funksiyalar

```sql
-- O'quvchi guruhning tasdiqlangan a'zosimi? (yoki admin)
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id uuid, _group_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id AND status = 'approved'
  ) OR public.has_role(_user_id, 'admin')
$$;

-- Guruhdagi tasdiqlangan a'zolar soni
CREATE OR REPLACE FUNCTION public.group_approved_count(_group_id uuid)
RETURNS int LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::int FROM public.group_members
  WHERE group_id = _group_id AND status = 'approved'
$$;
```

> `has_course_access()` endi darslarga kirish uchun ishlatilmaydi; o'rniga `is_group_member()` ishlatiladi.

### 2.6 RLS siyosatlari (asosiy)

**`groups`:**
- SELECT: `status IN ('recruiting','active','completed')` bo'lsa har qanday authenticated o'quvchi ko'radi (jadval/qabulni ko'rish uchun); `draft` faqat admin; a'zo bo'lsa doim ko'radi.
- ALL (boshqarish): admin.

```sql
CREATE POLICY "Read visible groups" ON public.groups FOR SELECT TO authenticated
  USING (status IN ('recruiting','active','completed')
         OR public.has_role(auth.uid(),'admin')
         OR public.is_group_member(auth.uid(), id));
CREATE POLICY "Admins manage groups" ON public.groups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
```

**`group_members`:**
- SELECT: o'z qatorlari yoki admin.
- INSERT: o'quvchi **faqat o'zi uchun** va **`pending`** holatda, va guruh **`recruiting`** bo'lsa (trigger tekshiradi).
- UPDATE: o'quvchi **o'z** qatorini **`cancelled`**'ga o'tkaza oladi; admin har qanday holatga (capacity trigger bilan).

```sql
CREATE POLICY "Read own membership" ON public.group_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Student requests join" ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Student cancels own" ON public.group_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND status = 'cancelled');
CREATE POLICY "Admins manage members" ON public.group_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
```

**`modules` / `lessons` / `lesson_materials` / `quiz_questions`:** kirish guruh a'zoligiga ko'ra:
```sql
-- lessons misoli
DROP POLICY IF EXISTS "Enrolled users read lessons" ON public.lessons;
CREATE POLICY "Members read group lessons" ON public.lessons FOR SELECT TO authenticated
  USING (group_id IS NOT NULL AND public.is_group_member(auth.uid(), group_id));
-- "Admins manage lessons" saqlanadi
```
(Xuddi shu naqsh `modules`, `lesson_materials`, `quiz_questions` uchun — guruh a'zoligi orqali.)

**`notifications`** SELECT yangilanadi (guruh targetini qo'shish):
```sql
DROP POLICY IF EXISTS "Users read own or broadcast notifications" ON public.notifications;
CREATE POLICY "Users read targeted notifications" ON public.notifications FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR user_id = auth.uid()                                   -- bitta o'quvchiga
    OR (user_id IS NULL AND group_id IS NULL)                 -- butun platformaga
    OR (group_id IS NOT NULL AND public.is_group_member(auth.uid(), group_id)) -- guruhga
  );
```

**`payments`:** mavjud siyosatlar saqlanadi (o'z to'lovlari + admin). `group_id` qo'shilishi RLS'ni o'zgartirmaydi.

### 2.7 Triggerlar (sig'im + avto-bildirishnoma)

**Sig'im nazorati** (tasdiqlashda):
```sql
CREATE OR REPLACE FUNCTION public.enforce_group_capacity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cap int; cnt int; st group_status;
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT capacity, status INTO cap, st FROM public.groups WHERE id = NEW.group_id;
    SELECT count(*) INTO cnt FROM public.group_members
      WHERE group_id = NEW.group_id AND status = 'approved';
    IF cnt >= cap THEN
      RAISE EXCEPTION 'Guruh to''lgan (% / %)', cnt, cap;
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_enforce_capacity BEFORE INSERT OR UPDATE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_group_capacity();
```

**Qabul ochiqligini tekshirish** (so'rov yuborishda): yangi `pending` qator faqat guruh `recruiting` bo'lsa kiritiladi (trigger `RAISE EXCEPTION` aks holda).

**Avto-bildirishnomalar:**
- A'zolik `approved` → o'quvchiga "✅ Guruhga qabul qilindingiz" (+ telegram link).
- A'zolik `rejected` → o'quvchiga "So'rovingiz rad etildi".
- Guruh `status` → `active` → barcha `approved` a'zolarga "📣 Darslar boshlandi" (yoki admin qo'lda yuboradi — 6-bo'limga qarang).
- Mavjud `payment`/`feedback`/`news` triggerlari saqlanadi; payment matni guruhga moslashtiriladi.

### 2.8 Mavjud ma'lumotlarni ko'chirish (migration strategiyasi)

- **Kurslar:** o'zgarishsiz qoladi (endi "yo'nalish" sifatida).
- **Eski kurs darajasidagi modul/darslar:** kontent **yangidan**, guruh ichida yaratiladi (tasdiqlangan). Shuning uchun "darsliklarni guruhga ko'chirish" funksiyasi **kerak emas**. Migration'da eski kurs darajasidagi modul/dars (group_id=NULL, test ma'lumot) **tozalanadi**:
  ```sql
  DELETE FROM public.lessons WHERE group_id IS NULL;
  DELETE FROM public.modules WHERE group_id IS NULL;
  ```
  *(Eslatma: bu qaytarib bo'lmaydi — ijro oldidan zaxira/eksport tavsiya etiladi.)*
- **Tarif/`plans`/`user_plan`:** jadvallar **saqlanadi** (eski to'lov tarixi uchun), lekin yangi oqimda **ishlatilmaydi**. Sinov (trial) oqimi o'chiriladi. Student "Tarif" UI → "To'lovlar" (oylik, guruh asosida) ga almashtiriladi.

---

## 3. Admin panel o'zgarishlari

### 3.1 Guruhlar ro'yxati — `admin.groups.index.tsx` (yangi)
- Yo'nalish (kurs) va holat bo'yicha filtr.
- Har bir karta: nomi, yo'nalish, holat (badge), **sig'im progress bari** (masalan 18/25), narx, jadval (kunlar+vaqt), boshlanish sanasi, kutilayotgan so'rovlar soni (badge).
- "Yangi guruh" tugmasi.

### 3.2 Guruh yaratish — `admin.groups.new.tsx` (yangi)
Forma maydonlari (talabingizdagi "to'liq ma'lumot"):
- Yo'nalish (kurs) tanlash, nomi, tavsif.
- Sig'im (yoki min–max diapazon).
- Narx + davr (oylik/kurs).
- Jadval: hafta kunlari (checkbox), boshlanish/tugash vaqti.
- Boshlanish sanasi, davomiyligi (hafta).
- Telegram guruh havolasi, muqova rasmi.
- Holat (draft → recruiting).

### 3.3 Guruh sahifasi — `admin.groups.$groupId.tsx` (yangi, tablar bilan)
- **Ma'lumotlar:** guruh maydonlarini tahrirlash, holatni o'zgartirish (`recruiting`→`active`→`completed`), telegram link.
- **So'rovlar / A'zolar:**
  - *Kutilmoqda (pending):* o'quvchi ro'yxati → **Qabul qilish** / **Rad etish**. Sig'im to'lsa, qabul tugmasi bloklanadi.
  - *A'zolar (approved):* ro'yxat → **qo'lda chiqarish** (admin istalgan vaqtda bekor qiladi).
  - **Admin to'liq nazorat (tasdiqlangan):** guruh `active` bo'lsa ham admin pending so'rovlarni qabul qila oladi yoki a'zoni qo'lda bekor qila oladi. Yangi so'rov yuborish faqat o'quvchilar uchun yopiladi.
  - (Ixtiyoriy) admin o'quvchini **qo'lda qo'shish** (qidiruvdan tanlab, to'g'ridan-to'g'ri `approved`).
  - Sig'im indikatori (X/Y).
- **Darsliklar:** guruhga tegishli modul/darslar — **mavjud kontent muharririni qayta ishlatamiz** (4-bo'lim).

### 3.4 Guruh kontent muharriri (refactor)
- Hozir `admin.courses.$courseId.tsx` (2051 qator) ichida modul/dars/quiz/material/prezentatsiya boshqaruvi bor.
- Reja: shu mantiqni **`<GroupContentManager groupId=... />`** umumiy komponentga ajratamiz va guruh sahifasida ishlatamiz. Yangi modul/dars yaratilganda `group_id` (va `course_id` = guruhning kursi) avtomatik beriladi.
- `admin.courses.$courseId.tsx` soddalashadi: yo'nalish metama'lumoti (nom, muqova, kategoriya) + shu yo'nalishdagi guruhlar ro'yxati.

### 3.5 Bildirishnomalar — `admin.notifications.tsx` (yangilash)
Maqsad tanlagich qo'shamiz (talab: *"hamma belgilash turlari"*):
- **Butun platforma** (broadcast).
- **Bitta o'quvchi** (qidiruvdan tanlash).
- **Bitta yoki bir nechta guruh** (ko'p tanlash).
- **Tanlangan o'quvchilar** (ko'p tanlash).

Ko'p guruh/o'quvchi tanlanganda: server function har biriga alohida `notifications` qatori yaratadi (fan-out), guruh uchun esa `group_id` to'ldiriladi.

### 3.6 To'lovlar — `admin.payments.tsx` (yangilash)
- Endi `plan_id` o'rniga `group_id` + **oy (`period_month`)** + summa ko'rsatiladi.
- Filtr: guruh bo'yicha, oy bo'yicha, holat bo'yicha.
- (Ixtiyoriy) guruh bo'yicha oylik yig'im hisoboti: kim to'lagan / kim to'lamagan.
- Tasdiq/rad oqimi saqlanadi.
- `admin.plans.tsx` (Tariflar) yashiriladi/olib tashlanadi.

### 3.7 Admin sidebar
- "Boshqaruv" guruhiga **"Guruhlar"** qo'shiladi (`/admin/groups`).
- "Kurslar" → "Yo'nalishlar" deb qayta nomlanishi mumkin (ixtiyoriy).
- "Moliya" dan "Tariflar" olib tashlanadi.

---

## 4. Student panel o'zgarishlari

### 4.1 Qabul / Ochiq guruhlar — `app.admissions.tsx` (yangi)
- **Haftalik jadval ko'rinishi** (talab): hafta kunlari × vaqt panjarasi; har bir katakda ochiq guruh (yo'nalish, vaqt, narx, sig'im).
- Guruh kartasi: to'liq ma'lumot (kurs, kunlar, vaqt, narx, o'rinlar X/Y, boshlanish sanasi).
- **Qo'shilish so'rovi** tugmasi (guruh `recruiting` va to'lmagan bo'lsa).
- Allaqachon so'rov yuborgan bo'lsa: holat (kutilmoqda/tasdiqlangan) + **"So'rovni bekor qilish"** (o'quvchi mustaqil, admin aralashuvisiz).
- Guruh `active` bo'lsa: "Qabul yopilgan" deb ko'rsatiladi, lekin guruh jadvalda **ko'rinishda qoladi** (talab: ortiqcha savollarning oldini olish uchun).

### 4.2 Guruhlarim — `app.groups.index.tsx` (yangi, "Kurslarim" o'rniga)
- Faqat **tasdiqlangan a'zo** bo'lgan guruhlar.
- Har biri → guruh darsliklari sahifasi.
- **Bo'sh holat:** a'zo bo'lmasa — "Siz hali biror guruhga biriktirilmagansiz" + "Ochiq guruhlarni ko'rish" CTA.

### 4.3 Guruh darsliklari — `app.groups.$groupId...` (yangi)
- Mavjud kurs/dars ko'ruvchi (lesson player, quiz, material, prezentatsiya) **qayta ishlatiladi**, faqat manba `group_id`.
- Telegram guruh havolasi guruh header/ma'lumotlarida ko'rsatiladi (talab).

### 4.4 To'lovlar — `app.subscription.tsx` (qayta ishlash, tarifsiz, **oylik**)
- Tarif tanlash **olib tashlanadi**.
- Admin a'zo qilgan **va** guruh `active` (darslar boshlangan) bo'lsa → har bir guruh uchun **shu oygi to'lov** kartasi chiqadi (summa = guruh `price`, davr = joriy oy).
- O'quvchi bir nechta guruhda bo'lsa — **har bir guruh uchun alohida** oylik to'lov.
- Har bir karta: guruh nomi, oy, summa, holat (to'langan / kutilmoqda / to'lanmagan) + chek yuklash. Tarix oylar bo'yicha ko'rsatiladi.
- Chek yuklash + bildirishnomalar **deyarli o'zgarishsiz**, faqat guruh + oyga moslashtiriladi.
- Sidebar'dagi "Tarif" kartasi → "To'lov holati" (oylik, guruh bo'yicha) ga almashtiriladi.

### 4.5 Bosh sahifa (dashboard) — `app.index.tsx` (yangilash)
- Widgetlar: Mening guruhlarim, yaqin darslar (jadvaldan), ochiq qabullar, to'lov eslatmasi.
- `student-dashboard.functions.ts` guruh asosida yangilanadi.

### 4.6 Student sidebar
- "Kurslarim" → **"Guruhlarim"** (`/app/groups`).
- Yangi **"Ochiq guruhlar / Qabul"** (`/app/admissions`).
- "Tarif va to'lov" → **"To'lovlar"** (`/app/subscription` saqlanadi yoki `/app/payments`).

---

## 5. Bildirishnoma turlari (xulosa)

| Tur | `user_id` | `group_id` | Kim ko'radi |
|---|---|---|---|
| Butun platforma | NULL | NULL | Hamma |
| Bitta o'quvchi | X | NULL | Faqat X |
| Bitta guruh | NULL | G | G ning `approved` a'zolari |
| Bir nechta guruh | NULL | har biri | har bir guruh a'zolari (fan-out) |
| Tanlangan o'quvchilar | har biri | NULL | tanlangan o'quvchilar (fan-out) |

---

## 6. Kirish nazorati (yakuniy qaror)

- Guruh **darsliklariga** kirish = **`is_group_member()`** (admin tasdiqlagan `approved` a'zolik). Boshqa hech narsa (tarif/to'lov) talab qilinmaydi.
- **To'lov** alohida: kuzatiladi, student panelida ko'rsatiladi, lekin darslarga kirishni **bloklamaydi**.
- Admin har doim hammasini ko'radi.

---

## 7. Bosqichma-bosqich ishlab chiqish rejasi

| Bosqich | Mazmun | Asosiy fayllar |
|---|---|---|
| **0. DB poydevor** | Migration: enum, `groups`, `group_members`, ustun qo'shishlar, helper fn, RLS, triggerlar. `types.ts` yangilash. Jonli Supabase'ga qo'llash. | `supabase/migrations/...`, `full-schema.sql`, `types.ts` |
| **1. Admin: guruhlar** | Guruh ro'yxati, yaratish, tahrirlash, holat. | `admin.groups.index.tsx`, `admin.groups.new.tsx`, `admin.groups.$groupId.tsx`, `admin-sidebar.tsx` |
| **2. Admin: so'rovlar** | Qabul/rad, a'zolar, sig'im. | `admin.groups.$groupId.tsx`, server fn |
| **3. Admin: kontent** | Kontent muharririni guruhga ko'chirish (refactor). | `GroupContentManager`, `admin.courses.$courseId.tsx` |
| **4. Admin: bildirishnoma** | Guruh/o'quvchi targeting. | `admin.notifications.tsx`, server fn |
| **5. Student: qabul** | Haftalik jadval, so'rov yuborish/bekor qilish. | `app.admissions.tsx`, `student-sidebar.tsx` |
| **6. Student: guruhlarim** | Guruhlarim + darsliklar. | `app.groups.index.tsx`, `app.groups.$groupId...` |
| **7. To'lov** | Tarifsiz, guruh asosida (admin + student). | `app.subscription.tsx`, `admin.payments.tsx` |
| **8. Dashboard + tozalash** | Widgetlar, sidebar, tarif olib tashlash, QA. | `app.index.tsx`, `admin-stats`, `student-dashboard` |

> Sizning tanlovingiz "avval reja" edi. Tasdiqlagach, men odatda **0 → 2** (DB + admin guruh boshqaruvi) ni birinchi yetkazib beraman, keyin student tomon.

---

## 8. Qarorlar (tasdiqlangan) va qolgan taxminlar

**✅ Tasdiqlangan (sizdan):**

1. **Narx davri — OYLIK.** O'quvchi o'qiyotgan guruh(lar) narxidan kelib chiqib **har oy** to'laydi. Bir nechta guruhda bo'lsa, har biri uchun alohida oylik to'lov. (`price_period='monthly'`, `payments.period_month`).
4. **Admin to'liq nazoratga ega.** Guruh `active` bo'lsa ham admin pending so'rovni qabul qila oladi yoki a'zoni qo'lda bekor qila oladi. Yangi so'rov faqat o'quvchilar uchun yopiladi (avto-bekor qilinmaydi).
5. **Kontent yangidan yaratiladi.** Eski kurs darajasidagi darsliklar ko'chirilmaydi; migration'da tozalanadi. Yangi darsliklar to'g'ridan-to'g'ri guruh ichida quriladi.

**Qolgan taxminlar** (e'tiroz bo'lmasa shu bo'yicha ketamiz):

2. **Telegram:** havola **qo'lda** kiritiladi (avtomatik guruh ochish yo'q).
3. **Bir o'quvchi bir nechta guruhda** bo'la oladi (turli yo'nalishlar).
6. **Yo'nalish (kurs) larni** admin yaratadi, hozirgidek.
7. **Vaqt mintaqasi:** Asia/Tashkent.

---

## 9. Xavflar / e'tibor

- **Kontent muharriri refaktori** eng katta ish (2051 qatorli fayl). Ehtiyotkorlik bilan, umumiy komponentga ajratib qilamiz.
- **Jonli DB migration** — qaytarib bo'lmaydigan amallar (`DROP NOT NULL` xavfsiz; lekin eski kontentni o'chirish — yo'q, faqat tasdiqlasangiz). Migration'ni avval `IF NOT EXISTS`/idempotent yozamiz.
- **RLS to'g'riligi** — guruh izolyatsiyasi ("2-Frontend ≠ 4-Frontend") to'liq RLS testlari bilan tekshiriladi.
- **Orqaga moslik** — `course_id` ustunlari saqlanadi, eski yozuvlar buzilmaydi.

---

*Keyingi qadam: ushbu rejani tasdiqlang (yoki 8-bo'limdagi savollarga javob bering). So'ng 0-bosqich (DB) dan boshlaymiz.*

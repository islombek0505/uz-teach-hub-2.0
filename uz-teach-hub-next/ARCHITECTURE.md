# UzTeachHub — Arxitektura (clone-app1 uslubida)

Bu loyiha `clone-app1` ning toza, "dinamik" arxitekturasini `uz-teach-hub` LMS domeniga ko'chiradi.
Stack to'liq **Next.js 15 (App Router)** ga o'tkazildi; ma'lumotlar bazasi sifatida **Supabase** saqlandi.

## Asosiy g'oya

Eski kodda har bir route fayli o'z ichida supabase chaqiruvlari, useState'lar, dialoglar va
jadvallarni aralashtirgan edi (eng kattasi — 2051 qator, 43 ta `useState`). Yangi arxitekturada
har bir narsa qatlamlarga ajratilgan va **takrorlanuvchi kod generic "creator"larga** chiqarilgan.

## Papka tuzilishi

```
app/
  (admin)/admin/...     # Admin paneli (rol: admin)
  (app)/app/...         # O'quvchi paneli (rol: student)
  auth/...              # Kirish / ro'yxatdan o'tish (ochiq)
  layout.tsx            # Root layout (shrift, Toaster)
components/
  ui/                   # shadcn primitivlari
  creators/             # TableCreator, DialogCreator, SheetCreator, TableActionsCreator
  shared/               # Container, Section, Sidebar, Topbar, ProtectedLayout, formalar
  student/              # O'quvchiga oid komponentlar (CourseCard)
stores/                 # Entity store'lar — har biri 1 qator (createStoreCreator)
service/                # APIServiceController — join/RPC/storage uchun
hooks/                  # useNetworkService, useAuth, usePublishedCourses
lib/                    # supabase client/server, validation (zod), utils, store.builder, auth
types/                  # database.ts (Supabase'dan generatsiya) + index.ts (ICreateX / IX)
constants/              # nav linklar, select variantlari
```

## 1. Ma'lumotlar qatlami — "dinamik" yadro

**`stores/store.creator.ts`** — bitta generic factory. Unga jadval konfiguratsiyasini bersangiz,
to'liq ishlaydigan CRUD store qaytaradi: `{ data, loading, err, fetch, add, update, remove }`.

Shuning uchun har bir entity store **bitta qator**:

```ts
// stores/courses.store.ts
export const useCoursesStore = createStoreCreator<ICourseWithCount, ICreateCourse, IUpdateCourse>({
  table: "courses",
  select: "*, lessons(count)",
  orderBy: { column: "created_at", ascending: false },
})
```

Ostida: `useNetworkService` (har bir so'rov o'tadigan yagona joy, `action(data, error)` uslubida)
va `APIServiceController` (join, RPC, signed URL, count — CRUD'ga sig'maydigan holatlar uchun).

## 2. Creator komponentlar

Takrorlanuvchi UI bir marta yozilgan, data orqali boshqariladi:

- **`TableCreator`** — header + data + `renderRow` + `loading` → skeleton/empty holatlar avtomatik.
- **`DialogCreator` / `SheetCreator`** — boshqariladigan modal/sheet (odatda yaratish/yangilash formalari).
- **`TableActionsCreator`** — `actions` massivi → qatordagi "⋯" menyu.

## 3. Presenter pattern

Har bir sahifa ikki qismdan iborat:

```tsx
function useXPagePresenter() { /* butun holat + logika shu yerda */ }
function XPagePresenter() {
  const { ... } = useXPagePresenter()   // toza render
  return ( ... )
}
```

## 4. Nomlash

`dot.separated` kichik harf: `course.form.tsx`, `table.creator.tsx`, `plan.form.tsx`.
Tiplar: `ICreateX` (insert), `IX` (to'liq qator), `IUpdateX` (patch).

## Yangi entity qo'shish (to'liq retsept)

1. **Type** (`types/index.ts`): `export type IThing = Row<"things">` (database.ts'dan avtomatik).
2. **Store** (`stores/thing.store.ts`): bitta qator `createStoreCreator<IThing, ICreateThing>({ table: "things" })`.
3. **Validation** (`lib/validation.ts`): `export const thingSchema = z.object({ ... })`.
4. **Form** (`.../components/thing.form.tsx`): `FormProps<IThing>` + react-hook-form + `toast.promise`.
5. **Sahifa**: `useThingsPagePresenter()` + `TableCreator` + `DialogCreator`/`SheetCreator`.

## Eski → Yangi moslik

| Eski (TanStack)                         | Yangi (Next.js)                                   |
|-----------------------------------------|---------------------------------------------------|
| `src/routes/admin.courses.index.tsx`    | `app/(admin)/admin/courses/page.tsx`              |
| `src/routes/admin.courses.$courseId.tsx`| `app/(admin)/admin/courses/[courseId]/page.tsx` (+ `components/`) |
| `src/routes/app.index.tsx`              | `app/(app)/app/page.tsx`                          |
| `src/routes/app.courses.$courseId.lessons.$lessonId.tsx` | `app/(app)/app/courses/[courseId]/lessons/[lessonId]/page.tsx` |
| `src/routes/auth.login.tsx`             | `app/auth/login/page.tsx`                         |
| supabase chaqiruvlari (route ichida)    | `stores/*.store.ts` + `service/service.controller.ts` |
| `src/integrations/supabase/client.ts`   | `lib/supabase/client.ts` + `server.ts`            |
| `src/lib/utils.ts`                      | `lib/utils.ts`                                     |
```

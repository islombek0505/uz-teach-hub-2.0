# PROMPT / TTZ — Til o'rganish platformasi (Dashboardlar)

> Ushbu matnni AI builder'ga (Lovable, v0, Cursor, Bolt va h.k.) to'liq nusxalab joylashtiring.
> Bu **1-bosqich**: faqat **o'qituvchi (teacher)** va **o'quvchi (student)** dashboardlari.
> Texnologiya tanlovi — AI'ning ixtiyorida. Quyida faqat **nima** kerakligi yozilgan, **qanday** (qaysi framework, til, baza) emas.

---

## 0. AI uchun rol va vazifa

Sen tajribali **mahsulot dizayneri va frontend muhandisisan**. Quyidagi texnik topshiriq (TTZ) asosida **til o'rganish platformasi** uchun ikkita to'liq, jonli va zamonaviy **dashboard** yarat: biri o'quvchi uchun, biri o'qituvchi uchun.

Talablar:
- Avval **mock (namuna) ma'lumotlar** bilan ishlaydigan, to'liq ko'rinadigan UI yarat (keyin haqiqiy backend ulanadi).
- Kerakli texnologiyani o'zing tanla va loyihani o'zing tuzilmalashtirib ber.
- Natija: ishlaydigan, responsive, chiroyli va izchil dizaynli interfeys.
- Savol berma — TTZ'da yetishmagan tafsilotlar uchun mantiqiy, zamonaviy yechim tanla.

---

## 1. Mahsulot konteksti

- Bu — **rus tili** va **ingliz tili**ni o'rganish uchun onlayn platforma. U mavjud "OnlineTalim" ta'lim platformasining davomi (bir xil his-tuyg'u: tartibli, zamonaviy, ishonchli).
- Ikki asosiy rol: **O'quvchi** va **O'qituvchi**. Har birining alohida dashboard'i.
- Platforma ham **klassik ta'lim tizimi** (kurslar, modullar, darslar, testlar, baholash), ham **til o'rganish** (so'z yodlash, talaffuz, 4 ta ko'nikma, gamifikatsiya) xususiyatlarini birlashtiradi.
- Foydalanuvchilar — asosan o'zbek auditoriyasi, rus/ingliz tilini o'rganadi.

---

## 2. Asosiy maqsad (nega kerak)

**O'quvchi dashboard** maqsadi: foydalanuvchi platformaga kirgan zahoti "**bugun nima qilishim kerak**" degan savolga aniq javob olsin, motivatsiyasi oshsin (streak, XP, daraja), va progressini ko'rib turaversin.

**O'qituvchi dashboard** maqsadi: o'qituvchi bir qarashda **kim qanday holatda**ekanini ko'rsin, tekshirish kerak bo'lgan ishlarni topsin, **e'tibor kerak bo'lgan** (orqada qolayotgan) o'quvchilarni ajratib olsin va tezkor amal qila olsin.

---

## 3. Umumiy talablar (har ikkala dashboard uchun)

1. **Ko'p tillilik (UZ / RU / EN):** butun interfeys 3 tilda. Header'da til almashtirgich (UZ/RU/EN). Tanlangan til saqlanadi. Sana, raqam, vaqt formatlari tilga moslashadi. Interfeys matnlari tarjima qilinadigan (i18n) tarzda tashkillansin.
2. **Responsive:** telefon, planshet, kompyuter — barchasida mukammal. Mobil'da sidebar drawer'ga aylanadi.
3. **Light / Dark rejim:** ikkala rejim ham qo'llab-quvvatlansin, almashtirish tugmasi bilan.
4. **Layout:** chap tomonda sidebar (navigatsiya + rol bo'yicha menyu), tepada header (qidiruv, til almashtirgich, bildirishnomalar, profil menyusi), markazda dashboard kontenti.
5. **Holatlar:** skeleton (yuklanish), bo'sh holat (empty state, chiroyli illyustratsiya + CTA), xatolik holati — barchasi ishlangan bo'lsin.
6. **Dizayn tili:** zamonaviy, minimal, toza; yumshoq soyali kartalar, aniq tipografika, yetarli bo'sh joy (whitespace), grafiklar. Gamifikatsiya elementlari (XP, streak, nishonlar) jonli va quvnoq ko'rinsin, lekin ortiqcha bo'lmasin.
7. **Real-time tuyg'u:** bildirishnomalar soni, progress, faollik kabi ko'rsatkichlar yangilanib turgandek his qildirsin (mock'da ham animatsiya/badge bilan).
8. **Tezlik va a'lo UX:** mikro-animatsiyalar, hover holatlar, klaviatura bilan boshqarish, accessible (ARIA, kontrast).

---

## 4. O'QUVCHI DASHBOARD (student)

Sahifa o'quvchining "bosh sahifasi" bo'ladi. Quyidagi bloklar (widget'lar) bo'lsin:

### 4.1 Yuqori qism — motivatsiya
- **Salomlashish** (ism + til): "Salom, Islom! Bugun nimani o'rganamiz?"
- **Streak (ketma-ket kunlar)** — olovli ikonka + kun soni; "X kun ketma-ket".
- **Kunlik maqsad** — XP yoki daqiqa bo'yicha halqa-progress (masalan 20/30 XP). Maqsadni tahrirlash imkoni.
- **Joriy daraja (CEFR: A1–C2)** — har bir til (RU va EN) uchun alohida ko'rsatilsin, foiz bilan.

### 4.2 Davom etish
- **"Davom eting"** kartasi — oxirgi boshlangan kurs/dars, muqova, foiz va "Davom etish" tugmasi.
- **Bugungi tavsiya** — keyingi mantiqiy dars yoki mashq.

### 4.3 Til o'rganish bloklari (eng muhim "extra" funksiyalar)
- **So'z yodlash (Flashcards / SRS — interval takrorlash):** bugun takrorlanishi kerak bo'lgan so'zlar soni + "Takrorlashni boshlash" tugmasi. Yangi so'zlar / o'rganilgan so'zlar / takror kerak bo'lganlar.
- **Shaxsiy lug'at (Vocabulary):** o'rganilgan so'zlar ro'yxati, "Kun so'zi" (Word of the day).
- **4 ta ko'nikma bo'yicha progress:** Reading (o'qish), Listening (tinglash), Speaking (gapirish), Writing (yozish) — har biriga alohida indikator.
- **Talaffuz / Gapirish mashqi (Speaking):** mikrofon orqali talaffuz mashqi kartasi (UI darajasida; baholash keyin AI orqali). "Bugungi talaffuz mashqi".
- **AI suhbatdosh (Conversation practice):** tanlangan tilda AI bilan suhbat mashqini boshlash kartasi.
- **Grammatika — zaif joylar:** o'quvchi ko'p xato qiladigan mavzular ro'yxati + "Mashq qilish".

### 4.4 Vazifalar va natijalar
- **Topshiriqlar (Assignments):** muddati bilan, holati (bajarilgan/kutilmoqda/muddati o'tgan).
- **So'nggi test natijalari:** ball, o'tdi/o'tmadi, qayta urinish.

### 4.5 Gamifikatsiya
- **Reyting (Leaderboard / liga):** haftalik reyting, o'quvchining o'rni.
- **Nishonlar (Badges) va yutuqlar (Achievements):** olingan va olinishi mumkin bo'lganlar.

### 4.6 Jadval va xabarlar
- **Kalendar / yaqin darslar** — agar jonli (live) darslar bo'lsa.
- **Bildirishnomalar** — yangi vazifa, javob, eslatma ("Bugungi mashqni unutmang").

---

## 5. O'QITUVCHI DASHBOARD (teacher)

O'qituvchining boshqaruv markazi. Quyidagi bloklar bo'lsin:

### 5.1 KPI kartalari (yuqori qator)
- Jami o'quvchilar soni.
- Faol o'quvchilar (bu hafta).
- O'rtacha progress (%).
- Tekshirilmagan ishlar (topshiriq/test) soni.
- (Har bir kartada o'tgan haftaga nisbatan o'zgarish ko'rsatilsin: ▲/▼.)

### 5.2 O'quvchilar holati
- **O'quvchilar / guruhlar ro'yxati:** ism, til (RU/EN), daraja, umumiy progress, oxirgi faollik vaqti.
- **E'tibor kerak (At-risk):** uzoq kirmagan yoki orqada qolayotgan o'quvchilar alohida ajratib ko'rsatilsin (qizil/sariq belgilar).
- Har bir o'quvchiga bosilganda — uning batafsil sahifasiga o'tish (drill-down).

### 5.3 Tekshirish navbati
- **Baholash kerak bo'lgan ishlar:** yozma (Writing) va gapirish (Speaking) topshiriqlari qo'lda baholanadi — navbat ro'yxati, "Tekshirish" tugmasi.

### 5.4 Jadval va faollik
- **Bugungi / yaqin darslar (jonli darslar bo'lsa):** vaqti, guruh, qatnashuvchilar.
- **Faollik grafigi:** o'quvchilarning haftalik faolligi (ustun yoki chiziq grafik).
- **Eng faol va eng past o'quvchilar.**

### 5.5 Til o'rganishga oid tahliliy bloklar (extra funksiyalar)
- **So'z boyligi o'sishi:** guruh bo'yicha o'rtacha yangi so'zlar.
- **Talaffuz / Speaking ballari:** o'rtacha ko'rsatkich.
- **Umumiy xatolar (Common mistakes):** o'quvchilar ko'p xato qiladigan grammatik mavzular ro'yxati — o'qituvchi qaysi mavzuga urg'u berishni biladi.

### 5.6 Tezkor amallar
- Vazifa berish (Assign homework).
- E'lon / bildirishnoma yuborish.
- O'quvchiga xabar yozish.

---

## 6. Navigatsiya (sidebar)

**O'quvchi menyusi:** Bosh sahifa (Dashboard), Kurslarim, So'z yodlash, Mashqlar, Reyting, Jadval, Bildirishnomalar, Profil.

**O'qituvchi menyusi:** Dashboard, Guruhlar/O'quvchilar, Tekshirish, Kontent (kurslar/darslar), Jadval, Tahlil (Analytics), Bildirishnomalar, Profil.

> Bu bosqichda asosiy e'tibor **Dashboard** sahifalariga; qolgan menyu bo'limlari hozircha "tez orada" yoki bo'sh-holat sahifa bo'lishi mumkin.

---

## 7. Rollar va ruxsatlar

- **O'quvchi** faqat o'z ma'lumotini ko'radi.
- **O'qituvchi** faqat o'ziga biriktirilgan guruh/o'quvchilarni ko'radi.
- Rolga qarab login'dan keyin mos dashboard'ga yo'naltirilsin.

---

## 8. Ma'lumotlar (mock bilan boshlash)

- Boshida realga o'xshash **namuna ma'lumotlar** ishlat: 8–12 ta o'quvchi, bir nechta guruh, kurslar (rus/ingliz), darslar, so'zlar, test natijalari, streak, XP, nishonlar.
- Ma'lumot tuzilmasi keyin haqiqiy backend'ga oson ulanadigan tarzda ajratilgan bo'lsin (UI va ma'lumot manbai bir-biridan ajratilgan).

---

## 9. Qabul mezonlari (Definition of Done)

- [ ] Ikkala dashboard (o'quvchi + o'qituvchi) to'liq, jonli va namuna ma'lumot bilan ishlaydi.
- [ ] UZ/RU/EN tillari ishlaydi; til almashtirgich saqlanadi.
- [ ] Light va Dark rejim ishlaydi.
- [ ] Telefon va kompyuterda mukammal ko'rinadi (responsive).
- [ ] Skeleton, bo'sh holat va xatolik holatlari mavjud.
- [ ] Til o'rganishga oid bloklar (streak, XP, daraja CEFR, so'z yodlash/SRS, 4 ko'nikma, talaffuz, leaderboard) mavjud.
- [ ] Dizayn izchil, zamonaviy va toza.

---

## 10. Bu bosqichda KIRMAYDI (keyingi bosqichlar)

- To'lov/obuna tizimi.
- To'liq kontent yaratish (CMS), video pleyer, test mexanikasi ichki sahifalari.
- Haqiqiy autentifikatsiya va baza ulanishi (hozircha mock).
- Mobil ilova.

> Bularni hozir qilma — faqat **dashboardlar**ga e'tibor qarat.

---

### Yakuniy ko'rsatma AI'ga
Yuqoridagi TTZ asosida ikkala dashboard'ni yarat. Zamonaviy, jonli va til o'rganish platformasiga mos his-tuyg'u ber (Duolingo/Busuu ruhidagi gamifikatsiya + jiddiy LMS tartibi). Mock ma'lumat bilan to'liq ishlaydigan natija ko'rsat.

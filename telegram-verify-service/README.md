# Telegram Verify Service

Telefon raqami orqali **Telegram'ga tasdiqlash kodi** yuboradigan va tekshiradigan universal mikroservis. Bir marta deploy qilasiz — barcha loyihalaringizda (register / login) ishlatasiz.

Telegram'ning rasmiy **[Gateway API](https://core.telegram.org/gateway/api)**'si ustiga qurilgan: foydalanuvchi raqamini kiritadi → kod **o'sha raqamdagi Telegram akkountga** boradi. Foydalanuvchi avval botni ochishi yoki biror narsa qilishishi **shart emas**.

---

## Nega bot emas, Gateway?

Oddiy Telegram **bot** notanish raqamga yoza olmaydi — foydalanuvchi avval botga `/start` bosishi kerak. "Raqam → o'sha raqamga kod" oqimini faqat **Telegram Gateway API** beradi. Narxi: **~$0.01/kod**, o'z raqamingizga va test rejimida **bepul**, to'lov TON orqali.

---

## Qanday ishlaydi

```
  Sizning ilovangiz (backend)            Bu servis                 Telegram Gateway
  ───────────────────────────            ─────────                 ────────────────
  POST /v1/otp/send  { phone }  ───────▶ checkSendAbility ───────▶ raqam Telegram'da bormi?
                                         sendVerificationMessage ▶ KOD generatsiya + yuborish
                       ◀─── { requestId, expiresIn }              (kodni biz ko'rmaymiz)

  POST /v1/otp/verify { phone, code } ─▶ checkVerificationStatus ▶ kod to'g'rimi?
                       ◀─── { verified: true | false }
```

Kodni **Telegram generatsiya qiladi** — servisimiz uni hech qachon ko'rmaydi va saqlamaydi. Biz faqat `request_id` saqlaymiz va tekshirishni Telegram bajaradi (urinishlar soni ham Telegram tomonda nazoratda).

---

## 1. Telegram Gateway tokenini olish

1. [gateway.telegram.org](https://gateway.telegram.org) ga Telegram akkountingiz bilan kiring.
2. Account settings → **API token** ni nusxalang.
3. Test uchun balans shart emas (o'z raqamingizga bepul). Productionda balansni TON bilan to'ldiring.

## 2. Sozlash va ishga tushirish

```bash
cp .env.example .env
# .env ichiga TELEGRAM_GATEWAY_TOKEN va API_KEYS ni yozing

npm install
npm run dev          # development (auto-reload)
# yoki
npm run build && npm start   # production
```

`API_KEYS` — bu sizning **ilovalaringiz** servisga murojaat qilish uchun ishlatadigan maxfiy kalit(lar). Kuchli kalit yarating:

```bash
openssl rand -hex 32
```

### Docker bilan

```bash
docker build -t telegram-verify-service .
docker run -p 8787:8787 --env-file .env telegram-verify-service
```

---

## API

Barcha `/v1/*` so'rovlar `x-api-key` sarlavhasini talab qiladi. Ixtiyoriy `x-project-id` sarlavhasi har bir loyiha uchun rate-limit va holatni ajratadi.

### `POST /v1/otp/send`

```bash
curl -X POST http://localhost:8787/v1/otp/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: SIZNING_KALIT" \
  -H "x-project-id: uz-teach-hub" \
  -d '{ "phone": "+998901234567" }'
```

Javob:

```json
{ "ok": true, "data": { "requestId": "abc123", "phone": "+998901234567", "expiresIn": 300 } }
```

### `POST /v1/otp/verify`

```bash
curl -X POST http://localhost:8787/v1/otp/verify \
  -H "Content-Type: application/json" \
  -H "x-api-key: SIZNING_KALIT" \
  -H "x-project-id: uz-teach-hub" \
  -d '{ "phone": "+998901234567", "code": "123456" }'
```

Javob (to'g'ri):

```json
{ "ok": true, "data": { "verified": true } }
```

Javob (xato kod):

```json
{ "ok": true, "data": { "verified": false, "reason": "code_invalid", "attemptsLeft": 4 } }
```

### `GET /health`

Auth talab qilmaydi. Uptime monitoring uchun: `{ "ok": true, ... }`.

### Xato javob formati

```json
{ "ok": false, "error": { "code": "COOLDOWN", "message": "...", "retryAfter": 42 } }
```

| Kod | HTTP | Ma'nosi |
| --- | --- | --- |
| `UNAUTHORIZED` | 401 | `x-api-key` noto'g'ri yoki yo'q |
| `PHONE_INVALID` | 400 | Raqam E.164 formatida emas |
| `PHONE_NO_TELEGRAM` | 422 | Raqamda Telegram yo'q / kod yetkazib bo'lmaydi |
| `COOLDOWN` | 429 | Juda tez qayta so'rov (`retryAfter` kuting) |
| `RATE_LIMITED` / `IP_RATE_LIMITED` | 429 | Limit oshib ketdi |
| `NO_ACTIVE_CODE` | 404 | Bu raqam uchun aktiv kod yo'q |
| `CODE_EXPIRED` | 410 | Kod muddati o'tgan |
| `MAX_ATTEMPTS` | 429 | Juda ko'p xato urinish |
| `UPSTREAM_UNAVAILABLE` | 503 | Gateway balans/tarmoq muammosi |

---

## Ko'p loyihada ishlatish

- Har bir loyihaga **alohida API kalit** bering: `API_KEYS=key_teachhub,key_shop,key_crm`. Birini revoke qilsangiz boshqalari ishlayveradi.
- Har bir loyiha o'z `x-project-id` ini yuborsin — rate-limit va kod holati loyihalar orasida aralashmaydi.
- Bitta servis instansi cheksiz loyihaga xizmat qiladi.

---

## Ilovaga ulash (TypeScript SDK)

`src/client/telegramVerifyClient.ts` faylini istalgan loyihaga nusxalang (bog'liqliksiz, `fetch` ishlatadi).

> ⚠️ **Xavfsizlik:** API kalit — maxfiy. SDK'ni **server tomonda** chaqiring (API route / server function / edge function), brauzerda emas. Brauzerdan o'z backendingizga murojaat qiling, u esa servisga.

```ts
import { TelegramVerifyClient } from "./telegramVerifyClient";

const verify = new TelegramVerifyClient({
  baseUrl: process.env.VERIFY_URL!,      // masalan https://verify.mycompany.com
  apiKey: process.env.VERIFY_API_KEY!,
  projectId: "uz-teach-hub",
});

await verify.sendCode("+998901234567");
const { verified } = await verify.verifyCode("+998901234567", "123456");
```

### Misol: uz-teach-hub register oqimiga ulash

Soxta OTP (`auth.register.tsx`dagi `TODO(Eskiz)`) o'rniga. TanStack Start server funksiyalari yarating:

```ts
// src/lib/verify.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { TelegramVerifyClient } from "@/lib/telegramVerifyClient";

const verify = new TelegramVerifyClient({
  baseUrl: process.env.VERIFY_URL!,
  apiKey: process.env.VERIFY_API_KEY!,
  projectId: "uz-teach-hub",
});

export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string }) => d)
  .handler(async ({ data }) => {
    await verify.sendCode(data.phone);
    return { ok: true };
  });

export const checkOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; code: string }) => d)
  .handler(async ({ data }) => {
    const res = await verify.verifyCode(data.phone, data.code);
    return { verified: res.verified };
  });
```

So'ng `auth.register.tsx`da:

```ts
const send = useServerFn(sendOtp);
const check = useServerFn(checkOtp);

// 1-qadam: "SMS kod yuborish" tugmasi
const sendSms = async () => { await send({ data: { phone } }); setStep("otp"); };

// 2-qadam: kodni tekshirish (klient tomonda EMAS, serverda)
const verifyOtp = async () => {
  const { verified } = await check({ data: { phone, code: otp } });
  if (!verified) return toast.error("Kod noto'g'ri");
  setStep("password");
};
```

Login uchun ham xuddi shu: parolni unutganda yoki kirishda raqamni tasdiqlash.

---

## Xavfsizlik va ishlab chiqarish eslatmalari

- **Kod backendda saqlanmaydi** — Telegram generatsiya qiladi va tekshiradi.
- **Rate limiting** ikki qatlamda: telefon bo'yicha (cooldown + oyna limiti) va IP bo'yicha. `.env`da sozlanadi.
- **API kalitlar** doimiy-vaqtli (constant-time) solishtiriladi.
- **In-memory store** — bitta instans uchun. Bir nechta instans / qayta ishga tushganda saqlanish kerak bo'lsa, `OtpStore` interfeysini Redis bilan amalga oshiring (`src/store/types.ts`) va `src/index.ts`da `MemoryStore`'ni almashtiring — qolgan kod o'zgarmaydi.
- Proxy / load balancer ortida ishlasa, `trust proxy` yoqilgan (real IP uchun).

## Loyiha tuzilmasi

```
src/
  index.ts              kirish nuqtasi (komponentlarni ulaydi)
  server.ts             Express ilova (CORS, health, marshrutlar)
  config.ts             .env tekshiruvi (zod)
  telegramGateway.ts    Gateway API klient (typed)
  otpService.ts         biznes-logika (send/verify, rate-limit)
  store/                OtpStore interfeysi + MemoryStore
  middleware/           apiKey, ipRateLimit, errorHandler
  routes/otp.ts         /v1/otp/send, /v1/otp/verify
  utils/                phone (E.164), logger
  client/               loyihalarga nusxalanadigan SDK
```

## Litsenziya

MIT — istalgan loyihangizda erkin ishlating.

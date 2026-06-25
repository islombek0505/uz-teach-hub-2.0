import { z } from "zod"

/* ------------------------------- Auth -------------------------------- */
export const loginSchema = z.object({
  phone: z.string().trim().min(7, { message: "Telefon raqam kiritilmadi" }),
  password: z.string().min(6, { message: "Parol kamida 6 ta belgidan iborat" }),
})

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, { message: "Ism familiya kiritilmadi" }),
    phone: z.string().trim().min(7, { message: "Telefon raqam kiritilmadi" }),
    password: z.string().min(6, { message: "Parol kamida 6 ta belgidan iborat" }),
    confirm: z.string().min(6, { message: "Parolni tasdiqlang" }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Parollar mos kelmadi",
    path: ["confirm"],
  })

/* ------------------------------ Courses ------------------------------ */
export const courseSchema = z.object({
  title: z.string().trim().min(2, { message: "Kurs nomi kiritilmadi" }),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
  cover_url: z.string().trim().optional(),
  published: z.boolean().optional(),
})

export const moduleSchema = z.object({
  title: z.string().trim().min(2, { message: "Modul nomi kiritilmadi" }),
  description: z.string().trim().optional(),
})

// Lesson "type" matches the DB enum (video | text | presentation).
// Quizzes are a flag on a lesson (has_quiz), not a separate lesson type.
export const lessonSchema = z.object({
  title: z.string().trim().min(2, { message: "Dars nomi kiritilmadi" }),
  description: z.string().trim().optional(),
  type: z.enum(["video", "text", "presentation"]),
  content: z.string().optional(),
  has_quiz: z.boolean().optional(),
  pass_threshold: z.number().min(0).max(100).optional(),
})

/* ------------------------------- Plans ------------------------------- */
export const planSchema = z.object({
  title: z.string().trim().min(2, { message: "Tarif nomi kiritilmadi" }),
  code: z.string().trim().min(1, { message: "Tarif kodi kiritilmadi" }),
  description: z.string().trim().optional(),
  price: z.number().min(0, { message: "Narx manfiy bo'lmasin" }),
  duration_days: z.number().int().min(1, { message: "Muddat kamida 1 kun" }),
  is_active: z.boolean().optional(),
})

/* ------------------------------- News -------------------------------- */
export const newsSchema = z.object({
  title: z.string().trim().min(2, { message: "Sarlavha kiritilmadi" }),
  body: z.string().trim().optional(),
  category: z.string().trim().min(1, { message: "Bo'lim kiritilmadi" }),
  image_url: z.string().trim().optional(),
  link: z.string().trim().optional(),
  published: z.boolean().optional(),
})

/* ----------------------------- Payments ------------------------------ */
export const paymentCardSchema = z.object({
  label: z.string().trim().min(1, { message: "Nomi kiritilmadi" }),
  holder_name: z.string().trim().min(1, { message: "Karta egasi kiritilmadi" }),
  card_number: z.string().trim().min(8, { message: "Karta raqami noto'g'ri" }),
  bank: z.string().trim().optional(),
  is_active: z.boolean().optional(),
})

/* ----------------------------- Feedback ------------------------------ */
// "type" matches the DB feedback_type enum.
export const feedbackSchema = z.object({
  type: z.enum(["suggestion", "feedback", "complaint", "question"]),
  subject: z.string().trim().min(2, { message: "Mavzu kiritilmadi" }),
  message: z.string().trim().min(5, { message: "Xabar juda qisqa" }),
})

/* ------------------------------ Profile ------------------------------ */
export const profileSchema = z.object({
  full_name: z.string().trim().min(2, { message: "Ism familiya kiritilmadi" }),
  phone: z.string().trim().optional(),
})

/* --------------------------- Quiz question --------------------------- */
export const quizQuestionSchema = z.object({
  question: z.string().trim().min(2, { message: "Savol kiritilmadi" }),
  options: z.array(z.string().trim().min(1)).min(2, { message: "Kamida 2 ta variant" }),
  correct_index: z.number().int().min(0),
})

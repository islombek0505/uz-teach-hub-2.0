import { ReactNode } from "react"
import type { Database } from "./database"

/* ------------------------------------------------------------------ *
 * Shared UI/prop types (ported from clone-app1)
 * ------------------------------------------------------------------ */

export interface PropsChild {
  children: ReactNode
}

/** Discriminated union for create/update forms — one form, two modes. */
export type FormProps<UpdateT> =
  | { type: "POST"; closeAction?: () => void; updateData?: never }
  | { type: "UPDATE"; closeAction?: () => void; updateData: UpdateT }

/* ------------------------------------------------------------------ *
 * Entity types — derived from the generated Supabase schema so they
 * never drift. Convention mirrors clone-app1:
 *   IX        = full row (has id)
 *   ICreateX  = insert payload
 *   IUpdateX  = patch payload
 * ------------------------------------------------------------------ */

type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type ICourse = Row<"courses">
export type ICreateCourse = Insert<"courses">
export type IUpdateCourse = Update<"courses">

export type IModule = Row<"modules">
export type ICreateModule = Insert<"modules">

export type ILesson = Row<"lessons">
export type ICreateLesson = Insert<"lessons">
export type IUpdateLesson = Update<"lessons">

export type ILessonMaterial = Row<"lesson_materials">
export type ILessonProgress = Row<"lesson_progress">
export type ICoursePresentation = Row<"course_presentations">

export type IQuizQuestion = Row<"quiz_questions">
export type ICreateQuizQuestion = Insert<"quiz_questions">
export type IQuizAttempt = Row<"quiz_attempts">

export type IProfile = Row<"profiles">
export type IUpdateProfile = Update<"profiles">

export type IPlan = Row<"plans">
export type ICreatePlan = Insert<"plans">
export type IUpdatePlan = Update<"plans">

export type IUserPlan = Row<"user_plan">

export type IPayment = Row<"payments">
export type ICreatePayment = Insert<"payments">
export type IPaymentCard = Row<"payment_cards">
export type ICreatePaymentCard = Insert<"payment_cards">

export type INews = Row<"news">
export type ICreateNews = Insert<"news">
export type IUpdateNews = Update<"news">

export type INotification = Row<"notifications">
export type ICreateNotification = Insert<"notifications">

export type IFeedback = Row<"feedback">
export type ICreateFeedback = Insert<"feedback">

export type IContactChannel = Row<"contact_channels">
export type IPlatformSetting = Row<"platform_settings">

/* Enriched view models (joins) used by list screens. */
export interface ICourseWithCount extends ICourse {
  lessons?: { count: number }[]
}

export interface IModuleWithLessons extends IModule {
  lessons: ILesson[]
}

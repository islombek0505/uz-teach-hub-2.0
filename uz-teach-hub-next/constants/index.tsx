import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  CreditCard,
  Wallet,
  Bell,
  Newspaper,
  MessageSquare,
  UserCog,
  Settings2,
  Home,
  GraduationCap,
} from "lucide-react"

export interface INavLink {
  icon: React.ComponentType<{ className?: string }>
  title: string
  link: string
  /** Match exactly (true) or by prefix (false, default) for active state. */
  exact?: boolean
}

/* ----------------------------- Admin nav ----------------------------- */
export const adminNavLinks: INavLink[] = [
  { icon: LayoutDashboard, title: "Dashboard", link: "/admin", exact: true },
  { icon: BookOpen, title: "Kurslar", link: "/admin/courses" },
  { icon: Users, title: "O'quvchilar", link: "/admin/students" },
  { icon: BarChart3, title: "O'quvchilar statistikasi", link: "/admin/student-stats" },
  { icon: CreditCard, title: "Tariflar", link: "/admin/plans" },
  { icon: Wallet, title: "To'lovlar", link: "/admin/payments" },
  { icon: Bell, title: "Bildirishnomalar", link: "/admin/notifications" },
  { icon: Newspaper, title: "Yangiliklar", link: "/admin/news" },
  { icon: MessageSquare, title: "Takliflar", link: "/admin/feedback" },
  { icon: UserCog, title: "Mening profilim", link: "/admin/profile" },
  { icon: Settings2, title: "Sozlamalar", link: "/admin/settings" },
]

/* ---------------------------- Student nav ---------------------------- */
export const studentNavLinks: INavLink[] = [
  { icon: Home, title: "Bosh sahifa", link: "/app", exact: true },
  { icon: GraduationCap, title: "Kurslarim", link: "/app/courses" },
  { icon: Bell, title: "Bildirishnomalar", link: "/app/notifications" },
  { icon: CreditCard, title: "Tarif va to'lov", link: "/app/subscription" },
  { icon: MessageSquare, title: "Takliflar", link: "/app/feedback" },
  { icon: UserCog, title: "Profil", link: "/app/profile" },
]

/* --------------------- Shared select option sets --------------------- */
export const lessonTypeOptions = [
  { value: "video", label: "Video dars" },
  { value: "text", label: "Matnli dars" },
  { value: "presentation", label: "Taqdimot" },
]

export const paymentStatusOptions = [
  { value: "pending", label: "Kutilmoqda" },
  { value: "approved", label: "Tasdiqlangan" },
  { value: "rejected", label: "Rad etilgan" },
]

export const feedbackTypeOptions = [
  { value: "suggestion", label: "Taklif" },
  { value: "complaint", label: "Shikoyat" },
  { value: "question", label: "Savol" },
  { value: "feedback", label: "Fikr-mulohaza" },
]

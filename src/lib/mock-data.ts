export type LessonType = "video" | "presentation" | "text";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  duration: string;
  videoUrl?: string;
  presentationUrl?: string;
  content?: string;
  completed: boolean;
  quizScore?: number;
  hasQuiz: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  totalLessons: number;
  totalDuration: string;
  modules: Module[];
}

export const courses: Course[] = [
  {
    id: "c1",
    title: "Full-Stack Web Development",
    description:
      "Boshlang'ich darajadan professional darajagacha to'liq web dasturlash kursi. HTML, CSS, JavaScript, React va backend.",
    cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    category: "Dasturlash",
    totalLessons: 24,
    totalDuration: "18 soat",
    modules: [
      {
        id: "m1",
        title: "1-modul: Asoslar",
        description: "HTML va CSS asoslari",
        lessons: [
          { id: "l1", title: "Kirish va sozlash", description: "Kurs haqida umumiy ma'lumot", type: "video", duration: "12:34", completed: true, hasQuiz: true, quizScore: 95 },
          { id: "l2", title: "HTML strukturasi", description: "Teglar, atributlar, semantika", type: "video", duration: "18:20", completed: true, hasQuiz: true, quizScore: 88 },
          { id: "l3", title: "CSS asoslari", description: "Selektorlar, box model, flexbox", type: "video", duration: "24:10", completed: false, hasQuiz: true },
          { id: "l4", title: "Amaliyot: Birinchi sahifa", description: "Mini loyiha", type: "presentation", duration: "15:00", completed: false, hasQuiz: false },
        ],
      },
      {
        id: "m2",
        title: "2-modul: JavaScript",
        description: "Zamonaviy JavaScript",
        lessons: [
          { id: "l5", title: "JS asoslari", description: "O'zgaruvchilar, funksiyalar", type: "video", duration: "22:15", completed: false, hasQuiz: true },
          { id: "l6", title: "DOM bilan ishlash", description: "Sahifani boshqarish", type: "video", duration: "19:40", completed: false, hasQuiz: true },
          { id: "l7", title: "Async va Promises", description: "Asinxron kod", type: "video", duration: "28:00", completed: false, hasQuiz: true },
        ],
      },
      {
        id: "m3",
        title: "3-modul: React",
        description: "Zamonaviy frontend",
        lessons: [
          { id: "l8", title: "React komponentlari", description: "JSX va props", type: "video", duration: "20:30", completed: false, hasQuiz: true },
          { id: "l9", title: "Hooks", description: "useState, useEffect", type: "video", duration: "25:00", completed: false, hasQuiz: true },
        ],
      },
    ],
  },
  {
    id: "c2",
    title: "Mobile App Development (React Native)",
    description: "iOS va Android uchun mobil ilovalar yaratish.",
    cover: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    category: "Mobile",
    totalLessons: 16,
    totalDuration: "12 soat",
    modules: [
      {
        id: "m1",
        title: "1-modul: Boshlash",
        description: "Sozlash va asoslar",
        lessons: [
          { id: "l1", title: "React Native nima?", description: "Kirish darsi", type: "video", duration: "10:00", completed: false, hasQuiz: true },
          { id: "l2", title: "Loyiha sozlash", description: "Expo bilan ishlash", type: "video", duration: "15:00", completed: false, hasQuiz: false },
        ],
      },
    ],
  },
  {
    id: "c3",
    title: "UI/UX Design Mastery",
    description: "Figma, prototipirovka, dizayn tizimlari.",
    cover: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800&q=80",
    category: "Dizayn",
    totalLessons: 20,
    totalDuration: "15 soat",
    modules: [],
  },
];

export const mockUser = {
  id: "u1",
  name: "Akmal Yusupov",
  phone: "+998 90 123 45 67",
  avatar: "",
  joinedAt: "2025-09-15",
  subscription: {
    active: true,
    plan: "Standart",
    startDate: "2026-05-08",
    endDate: "2026-07-08",
    amount: 299000,
  },
};

export const mockStudents = [
  { id: "s1", name: "Akmal Yusupov", phone: "+998 90 123 45 67", joinedAt: "2025-09-15", progress: 42, activeCourse: "Full-Stack Web Dev", subscriptionStatus: "active", subscriptionEnd: "2026-07-08" },
  { id: "s2", name: "Madina Karimova", phone: "+998 91 234 56 78", joinedAt: "2025-10-02", progress: 78, activeCourse: "UI/UX Design", subscriptionStatus: "active", subscriptionEnd: "2026-06-20" },
  { id: "s3", name: "Bobur Toshmatov", phone: "+998 93 345 67 89", joinedAt: "2025-11-10", progress: 15, activeCourse: "Mobile App Dev", subscriptionStatus: "expired", subscriptionEnd: "2026-05-01" },
  { id: "s4", name: "Dilnoza Rahimova", phone: "+998 94 456 78 90", joinedAt: "2026-01-05", progress: 91, activeCourse: "Full-Stack Web Dev", subscriptionStatus: "active", subscriptionEnd: "2026-08-15" },
  { id: "s5", name: "Sardor Aliev", phone: "+998 97 567 89 01", joinedAt: "2026-02-18", progress: 60, activeCourse: "Full-Stack Web Dev", subscriptionStatus: "pending", subscriptionEnd: "—" },
  { id: "s6", name: "Nilufar Saidova", phone: "+998 99 678 90 12", joinedAt: "2026-03-22", progress: 34, activeCourse: "UI/UX Design", subscriptionStatus: "active", subscriptionEnd: "2026-06-30" },
];

export const mockPayments = [
  { id: "p1", studentName: "Akmal Yusupov", phone: "+998 90 123 45 67", amount: 299000, method: "Plastik karta (Humo)", date: "2026-05-08", status: "approved", note: "Telegram orqali tasdiqlangan" },
  { id: "p2", studentName: "Madina Karimova", phone: "+998 91 234 56 78", amount: 299000, method: "Uzcard", date: "2026-05-20", status: "approved", note: "" },
  { id: "p3", studentName: "Sardor Aliev", phone: "+998 97 567 89 01", amount: 299000, method: "Humo", date: "2026-06-07", status: "pending", note: "To'lov chekini yubordi, tekshirish kerak" },
  { id: "p4", studentName: "Bobur Toshmatov", phone: "+998 93 345 67 89", amount: 299000, method: "—", date: "2026-06-01", status: "expired", note: "Obuna muddati tugagan" },
];

export const mockFeedback = [
  { id: "f1", studentName: "Madina Karimova", subject: "JavaScript moduli", message: "Async qism juda yaxshi tushuntirildi, rahmat!", type: "feedback", date: "2026-06-05", read: true },
  { id: "f2", studentName: "Akmal Yusupov", subject: "Video sifati", message: "Ba'zi videolarda ovoz sekin chiqyapti, iltimos tekshiring.", type: "complaint", date: "2026-06-06", read: false },
  { id: "f3", studentName: "Dilnoza Rahimova", subject: "Yangi kurs taklifi", message: "Backend (Node.js) bo'yicha alohida kurs qo'shsangiz juda zo'r bo'lardi.", type: "suggestion", date: "2026-06-07", read: false },
];

export const adminStats = {
  totalStudents: 287,
  activeSubscriptions: 213,
  pendingPayments: 8,
  monthlyRevenue: 63627000,
  totalCourses: 3,
  totalLessons: 60,
};

export const progressChart = [
  { month: "Yan", students: 120, revenue: 35880000 },
  { month: "Fev", students: 145, revenue: 43355000 },
  { month: "Mar", students: 178, revenue: 53222000 },
  { month: "Apr", students: 201, revenue: 60099000 },
  { month: "May", students: 245, revenue: 73255000 },
  { month: "Iyun", students: 287, revenue: 85813000 },
];

export function formatPrice(n: number) {
  return n.toLocaleString("uz-UZ") + " so'm";
}
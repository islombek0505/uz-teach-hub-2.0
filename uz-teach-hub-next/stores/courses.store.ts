import { ICourseWithCount, ICreateCourse, IUpdateCourse } from "@/types"
import { createStoreCreator } from "./store.creator"

/** Courses — list includes a lesson count via an embedded relation. */
export const useCoursesStore = createStoreCreator<ICourseWithCount, ICreateCourse, IUpdateCourse>({
  table: "courses",
  select: "*, lessons(count)",
  orderBy: { column: "created_at", ascending: false },
})

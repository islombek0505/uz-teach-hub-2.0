"use client"

import { usePublishedCourses } from "@/hooks/usePublishedCourses"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import CourseCard from "@/components/student/course.card"
import { Skeleton } from "@/components/ui/skeleton"

function StudentCoursesPresenter() {
  const { courses, loading } = usePublishedCourses()

  return (
    <Container>
      <Topbar
        title="Kurslarim"
        desc={loading ? "Yuklanmoqda..." : `${courses.length} ta kurs mavjud`}
      />
      <Section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
          : courses.map((c) => <CourseCard key={c.id} course={c} />)}
      </Section>
    </Container>
  )
}

export default StudentCoursesPresenter

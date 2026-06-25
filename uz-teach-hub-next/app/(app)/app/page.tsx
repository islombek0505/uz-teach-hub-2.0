"use client"

import { usePublishedCourses } from "@/hooks/usePublishedCourses"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import CourseCard from "@/components/student/course.card"
import { Skeleton } from "@/components/ui/skeleton"

function StudentHomePresenter() {
  const { courses, loading } = usePublishedCourses()

  return (
    <Container>
      <Topbar title="Bosh sahifa" desc="Kurslarni tanlang va o'rganishni boshlang." />
      <Section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
          : courses.map((c) => <CourseCard key={c.id} course={c} />)}
        {!loading && courses.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            Hozircha kurslar mavjud emas.
          </p>
        )}
      </Section>
    </Container>
  )
}

export default StudentHomePresenter

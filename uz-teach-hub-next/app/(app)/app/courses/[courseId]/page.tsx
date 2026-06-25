"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, PlayCircle } from "lucide-react"

import APIServiceController from "@/service/service.controller"
import { ICourse, IModuleWithLessons } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function useCourseDetailPresenter(courseId: string) {
  const [course, setCourse] = useState<ICourse | null>(null)
  const [modules, setModules] = useState<IModuleWithLessons[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    APIServiceController.fetch<ICourse>(
      (db) => db.from("courses").select("*").eq("id", courseId).single() as never,
      (data) => setCourse(data)
    )
    APIServiceController.fetch<IModuleWithLessons[]>(
      (db) =>
        db
          .from("modules")
          .select("*, lessons(*)")
          .eq("course_id", courseId)
          .order("position", { ascending: true }) as never,
      (data) => {
        setModules((data ?? []).map((m) => ({ ...m, lessons: m.lessons ?? [] })))
        setLoading(false)
      }
    )
  }, [courseId])

  return { course, modules, loading }
}

function CourseDetailPresenter() {
  const { courseId } = useParams<{ courseId: string }>()
  const { course, modules, loading } = useCourseDetailPresenter(courseId)

  return (
    <Container>
      <Section className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href="/app/courses">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {loading ? <Skeleton className="h-7 w-56" /> : course?.title}
          </h1>
          <p className="text-sm text-muted-foreground">{course?.description}</p>
        </div>
      </Section>

      <Section className="mt-6">
        <Accordion type="multiple" className="space-y-2">
          {modules.map((m) => (
            <AccordionItem key={m.id} value={m.id} className="rounded-xl border bg-white px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">{m.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {m.lessons.map((l) => (
                    <Link
                      key={l.id}
                      href={`/app/courses/${courseId}/lessons/${l.id}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <PlayCircle className="size-4 text-primary" /> {l.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </Container>
  )
}

export default CourseDetailPresenter

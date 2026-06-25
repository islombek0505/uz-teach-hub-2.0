"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import APIServiceController from "@/service/service.controller"
import { ICourse, IModuleWithLessons } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import CourseForm from "../components/course.form"
import ModulesManager from "./components/modules.manager"

/* --------------------------- presenter hook --------------------------- */
function useCourseEditorPresenter(courseId: string) {
  const [course, setCourse] = useState<ICourse | null>(null)
  const [modules, setModules] = useState<IModuleWithLessons[]>([])
  const [loading, setLoading] = useState(true)

  const loadTree = useCallback(() => {
    APIServiceController.fetch<IModuleWithLessons[]>(
      (db) =>
        db
          .from("modules")
          .select("*, lessons(*)")
          .eq("course_id", courseId)
          .order("position", { ascending: true }) as never,
      (data) => setModules((data ?? []).map((m) => ({ ...m, lessons: m.lessons ?? [] })))
    )
  }, [courseId])

  useEffect(() => {
    APIServiceController.fetch<ICourse>(
      (db) => db.from("courses").select("*").eq("id", courseId).single() as never,
      (data) => {
        setCourse(data)
        setLoading(false)
      }
    )
    loadTree()
  }, [courseId, loadTree])

  return { course, modules, loading, loadTree }
}

/* ------------------------------ component ----------------------------- */
function CourseEditorPresenter() {
  const { courseId } = useParams<{ courseId: string }>()
  const { course, modules, loading, loadTree } = useCourseEditorPresenter(courseId)

  return (
    <Container>
      <Section className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/courses">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {loading ? <Skeleton className="h-7 w-48" /> : course?.title}
          </h1>
          <p className="text-sm text-muted-foreground">Kursni tahrirlash</p>
        </div>
      </Section>

      <Section className="mt-6">
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Kontent</TabsTrigger>
            <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <ModulesManager courseId={courseId} modules={modules} onChanged={loadTree} />
          </TabsContent>

          <TabsContent value="settings" className="mt-4 max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
            {course && <CourseForm type="UPDATE" updateData={{ ...course, lessons: [] }} />}
          </TabsContent>
        </Tabs>
      </Section>
    </Container>
  )
}

export default CourseEditorPresenter

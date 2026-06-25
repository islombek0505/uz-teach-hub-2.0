"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronLeft, CheckCircle2 } from "lucide-react"

import APIServiceController from "@/service/service.controller"
import { useAuth } from "@/hooks/useAuth"
import { ILesson } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function useLessonPresenter(courseId: string, lessonId: string) {
  const { user } = useAuth()
  const [lesson, setLesson] = useState<ILesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    APIServiceController.fetch<ILesson>(
      (db) => db.from("lessons").select("*").eq("id", lessonId).single() as never,
      (data) => {
        setLesson(data)
        setLoading(false)
      }
    )
  }, [lessonId])

  const markComplete = async () => {
    if (!user) return
    const promise = (async () => {
      const { error } = await APIServiceController.db.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          completed: true,
        },
        { onConflict: "user_id,lesson_id" }
      )
      if (error) throw new Error(error.message)
      setCompleted(true)
    })()
    toast.promise(promise, { loading: "Saqlanmoqda...", success: "Dars tugatildi!", error: "Xatolik!" })
  }

  return { lesson, loading, completed, markComplete }
}

function LessonViewerPresenter() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const { lesson, loading, completed, markComplete } = useLessonPresenter(courseId, lessonId)

  return (
    <Container className="max-w-4xl">
      <Section className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon">
          <Link href={`/app/courses/${courseId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {loading ? <Skeleton className="h-7 w-56" /> : lesson?.title}
        </h1>
      </Section>

      <Section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        {loading ? (
          <Skeleton className="aspect-video w-full rounded-xl" />
        ) : lesson?.type === "video" && lesson.bunny_video_id ? (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={`https://iframe.mediadelivery.net/embed/${lesson.bunny_library_id}/${lesson.bunny_video_id}`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : lesson?.type === "presentation" && lesson.presentation_slides?.length ? (
          <div className="space-y-3">
            {lesson.presentation_slides.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`Slayd ${i + 1}`} className="w-full rounded-lg border" />
            ))}
          </div>
        ) : (
          <div className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed">
            {lesson?.content || "Bu dars uchun matn mavjud emas."}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={markComplete} disabled={completed}>
            <CheckCircle2 className="size-4" />
            {completed ? "Tugatildi" : "Darsni tugatdim"}
          </Button>
        </div>
      </Section>
    </Container>
  )
}

export default LessonViewerPresenter

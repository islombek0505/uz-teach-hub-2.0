"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { BookOpen, Pencil, Plus } from "lucide-react"

import { useCoursesStore } from "@/stores/courses.store"
import { ICourseWithCount } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { DialogCreator } from "@/components/creators/dialog.creator"
import { SheetCreator } from "@/components/creators/sheet.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import CourseForm from "./components/course.form"

/* --------------------------- presenter hook --------------------------- */
function useCoursesPagePresenter() {
  const { data: courses, loading, fetch, remove } = useCoursesStore()
  const [open, setOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [current, setCurrent] = useState<ICourseWithCount | null>(null)

  useEffect(() => {
    fetch()
  }, [])

  const deleteAction = useCallback(
    (id: string) =>
      toast.promise(remove(id), {
        loading: "Kurs o'chirilmoqda...",
        success: "Kurs o'chirildi.",
        error: "Xatolik yuz berdi!",
      }),
    [remove]
  )

  const updateAction = (course: ICourseWithCount) => {
    setCurrent(course)
    setSheetOpen(true)
  }

  return { courses, loading, open, setOpen, sheetOpen, setSheetOpen, current, updateAction, deleteAction }
}

/* ------------------------------ component ----------------------------- */
function CoursesPagePresenter() {
  const { courses, loading, open, setOpen, sheetOpen, setSheetOpen, current, updateAction, deleteAction } =
    useCoursesPagePresenter()

  return (
    <Container>
      <Topbar
        title="Kurslar boshqaruvi"
        desc={loading ? "Yuklanmoqda..." : `${courses.length} ta kurs mavjud`}
        action={
          <DialogCreator
            triggerText="Yangi kurs"
            triggerIcon={<Plus className="size-4" />}
            open={open}
            setOpen={setOpen}
            title="Yangi kurs yaratish"
            desc="Kurs ma'lumotlarini to'ldiring"
          >
            <CourseForm type="POST" closeAction={() => setOpen(false)} />
          </DialogCreator>
        }
      />

      <Section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}

        {!loading &&
          courses.map((c) => (
            <Card key={c.id} className="overflow-hidden pt-0">
              <div
                className="aspect-video bg-muted bg-cover bg-center"
                style={c.cover_url ? { backgroundImage: `url(${c.cover_url})` } : undefined}
              />
              <CardContent className="px-5">
                <div className="flex flex-wrap gap-2">
                  {c.category && <Badge variant="secondary">{c.category}</Badge>}
                  {!c.published && <Badge variant="outline">Qoralama</Badge>}
                </div>
                <h3 className="mt-3 line-clamp-1 text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description ?? "—"}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="size-3.5" /> {c.lessons?.[0]?.count ?? 0} dars
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/courses/${c.id}`}>
                      <Pencil className="mr-1 size-3.5" /> Tahrirlash
                    </Link>
                  </Button>
                  <TableActionsCreator
                    actions={[
                      { name: "Tezkor o'zgartirish", action: () => updateAction(c) },
                      { name: "O'chirish", action: () => deleteAction(c.id), danger: true },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

        {!loading && courses.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-10 text-center text-muted-foreground">
              Hozircha kurslar yo'q. Yangi kurs yarating.
            </CardContent>
          </Card>
        )}
      </Section>

      {current && (
        <SheetCreator
          title="Kursni tahrirlash"
          desc="Kurs ma'lumotlarini yangilang"
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
        >
          <CourseForm type="UPDATE" updateData={current} closeAction={() => setSheetOpen(false)} />
        </SheetCreator>
      )}
    </Container>
  )
}

export default CoursesPagePresenter

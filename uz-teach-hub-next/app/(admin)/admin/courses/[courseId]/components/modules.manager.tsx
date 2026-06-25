"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Video, FileText, ListChecks, Presentation } from "lucide-react"

import APIServiceController from "@/service/service.controller"
import { ILesson, IModuleWithLessons } from "@/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogCreator } from "@/components/creators/dialog.creator"
import { SheetCreator } from "@/components/creators/sheet.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"
import LessonForm from "./lesson.form"

const lessonIcon = { video: Video, text: FileText, quiz: ListChecks, presentation: Presentation }

function ModulesManager({
  courseId,
  modules,
  onChanged,
}: {
  courseId: string
  modules: IModuleWithLessons[]
  onChanged: () => void
}) {
  const [moduleOpen, setModuleOpen] = useState(false)
  const [moduleTitle, setModuleTitle] = useState("")
  const [lessonDialog, setLessonDialog] = useState<string | null>(null)
  const [editLesson, setEditLesson] = useState<ILesson | null>(null)

  const addModule = async () => {
    if (!moduleTitle.trim()) return
    const promise = (async () => {
      const { error } = await APIServiceController.db
        .from("modules")
        .insert({ course_id: courseId, title: moduleTitle.trim(), position: modules.length })
      if (error) throw new Error(error.message)
    })()
    toast.promise(promise, { loading: "Qo'shilmoqda...", success: "Modul qo'shildi.", error: "Xatolik!" })
    await promise
    setModuleTitle("")
    setModuleOpen(false)
    onChanged()
  }

  const removeModule = (id: string) =>
    toast.promise(
      (async () => {
        const { error } = await APIServiceController.db.from("modules").delete().eq("id", id)
        if (error) throw new Error(error.message)
        onChanged()
      })(),
      { loading: "O'chirilmoqda...", success: "Modul o'chirildi.", error: "Xatolik!" }
    )

  const removeLesson = (id: string) =>
    toast.promise(
      (async () => {
        const { error } = await APIServiceController.db.from("lessons").delete().eq("id", id)
        if (error) throw new Error(error.message)
        onChanged()
      })(),
      { loading: "O'chirilmoqda...", success: "Dars o'chirildi.", error: "Xatolik!" }
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DialogCreator
          triggerText="Modul qo'shish"
          triggerIcon={<Plus className="size-4" />}
          open={moduleOpen}
          setOpen={setModuleOpen}
          title="Yangi modul"
          desc="Modul nomini kiriting"
        >
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Modul nomi"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModuleOpen(false)}>
                Bekor qilish
              </Button>
              <Button onClick={addModule}>Qo'shish</Button>
            </div>
          </div>
        </DialogCreator>
      </div>

      {modules.length === 0 && (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Hozircha modullar yo'q. Birinchi modulni qo'shing.
        </p>
      )}

      <Accordion type="multiple" className="space-y-2">
        {modules.map((m) => (
          <AccordionItem key={m.id} value={m.id} className="rounded-xl border px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-2 font-medium">
                {m.title}
                <span className="text-xs text-muted-foreground">({m.lessons.length} dars)</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {m.lessons.map((l) => {
                  const Icon = lessonIcon[l.type as keyof typeof lessonIcon] ?? FileText
                  return (
                    <div
                      key={l.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Icon className="size-4 text-muted-foreground" /> {l.title}
                      </span>
                      <TableActionsCreator
                        actions={[
                          { name: "Tahrirlash", action: () => setEditLesson(l) },
                          { name: "O'chirish", action: () => removeLesson(l.id), danger: true },
                        ]}
                      />
                    </div>
                  )
                })}

                <div className="flex items-center justify-between pt-2">
                  <DialogCreator
                    triggerText="Dars qo'shish"
                    triggerIcon={<Plus className="size-4" />}
                    open={lessonDialog === m.id}
                    setOpen={(o) => setLessonDialog(o ? m.id : null)}
                    title="Yangi dars"
                    desc="Dars ma'lumotlarini kiriting"
                  >
                    <LessonForm
                      type="POST"
                      moduleId={m.id}
                      courseId={courseId}
                      position={m.lessons.length}
                      onSaved={onChanged}
                      closeAction={() => setLessonDialog(null)}
                    />
                  </DialogCreator>

                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeModule(m.id)}>
                    Modulni o'chirish
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {editLesson && (
        <SheetCreator
          title="Darsni tahrirlash"
          desc="Dars ma'lumotlarini yangilang"
          sheetOpen={!!editLesson}
          setSheetOpen={(o) => !o && setEditLesson(null)}
        >
          <LessonForm
            type="UPDATE"
            updateData={editLesson}
            moduleId={editLesson.module_id}
            courseId={courseId}
            position={editLesson.position}
            onSaved={onChanged}
            closeAction={() => setEditLesson(null)}
          />
        </SheetCreator>
      )}
    </div>
  )
}

export default ModulesManager

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { lessonSchema } from "@/lib/validation"
import { lessonTypeOptions } from "@/constants"
import APIServiceController from "@/service/service.controller"
import { FormProps, ILesson } from "@/types"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type LessonFormProps = FormProps<ILesson> & {
  moduleId: string
  courseId: string
  position: number
  onSaved: () => void
}

function LessonForm({ type, updateData, closeAction, moduleId, courseId, position, onSaved }: LessonFormProps) {
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: updateData?.title ?? "",
      description: updateData?.description ?? "",
      type: (updateData?.type as z.infer<typeof lessonSchema>["type"]) ?? "video",
      content: updateData?.content ?? "",
    },
  })

  const onSubmit = async (data: z.infer<typeof lessonSchema>) => {
    const promise = (async () => {
      if (type === "POST") {
        const { error } = await APIServiceController.db
          .from("lessons")
          .insert({ ...data, module_id: moduleId, course_id: courseId, position })
        if (error) throw new Error(error.message)
      } else {
        const { error } = await APIServiceController.db
          .from("lessons")
          .update(data)
          .eq("id", updateData.id)
        if (error) throw new Error(error.message)
      }
    })()

    toast.promise(promise, {
      loading: "Saqlanmoqda...",
      success: type === "POST" ? "Dars qo'shildi." : "Dars yangilandi.",
      error: (e) => (e as Error).message,
    })
    await promise
    form.reset()
    onSaved()
    closeAction?.()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dars nomi</FormLabel>
              <FormControl>
                <Input placeholder="Dars nomi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dars turi</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Turi" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessonTypeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tavsif</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => closeAction?.()}>
            Bekor qilish
          </Button>
          <Button type="submit">{type === "POST" ? "Qo'shish" : "Saqlash"}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default LessonForm

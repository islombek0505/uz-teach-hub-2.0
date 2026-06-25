"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { courseSchema } from "@/lib/validation"
import { useCoursesStore } from "@/stores/courses.store"
import { FormProps, ICourseWithCount } from "@/types"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

function CourseForm({ type, updateData, closeAction }: FormProps<ICourseWithCount>) {
  const { add, update } = useCoursesStore()

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: updateData?.title ?? "",
      description: updateData?.description ?? "",
      category: updateData?.category ?? "",
      cover_url: updateData?.cover_url ?? "",
      published: updateData?.published ?? false,
    },
  })

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    const promise = type === "POST" ? add(data) : update(updateData.id, data)
    toast.promise(promise, {
      loading: type === "POST" ? "Kurs qo'shilmoqda..." : "Kurs yangilanmoqda...",
      success: type === "POST" ? "Kurs qo'shildi." : "Kurs yangilandi.",
      error: "Xatolik yuz berdi!",
    })
    await promise
    form.reset()
    closeAction?.()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kurs nomi</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Frontend asoslari" {...field} />
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
                <Textarea rows={3} placeholder="Kurs haqida qisqacha" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bo'lim</FormLabel>
              <FormControl>
                <Input placeholder="Masalan: Dasturlash" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Muqova rasmi (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="m-0">Chop etilgan</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="mt-2 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => closeAction?.()}>
            Bekor qilish
          </Button>
          <Button type="submit">{type === "POST" ? "Qo'shish" : "Saqlash"}</Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default CourseForm

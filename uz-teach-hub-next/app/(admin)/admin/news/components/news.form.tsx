"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { newsSchema } from "@/lib/validation"
import { useNewsStore } from "@/stores/news.store"
import { FormProps, INews } from "@/types"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

function NewsForm({ type, updateData, closeAction }: FormProps<INews>) {
  const { add, update } = useNewsStore()

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: updateData?.title ?? "",
      body: updateData?.body ?? "",
      category: updateData?.category ?? "umumiy",
      image_url: updateData?.image_url ?? "",
      link: updateData?.link ?? "",
      published: updateData?.published ?? true,
    },
  })

  const onSubmit = async (data: z.infer<typeof newsSchema>) => {
    const promise = type === "POST" ? add(data) : update(updateData.id, data)
    toast.promise(promise, {
      loading: "Saqlanmoqda...",
      success: type === "POST" ? "Yangilik qo'shildi." : "Yangilik yangilandi.",
      error: "Xatolik yuz berdi!",
    })
    await promise
    form.reset()
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
              <FormLabel>Sarlavha</FormLabel>
              <FormControl>
                <Input placeholder="Yangilik sarlavhasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matn</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bo'lim</FormLabel>
                <FormControl>
                  <Input placeholder="umumiy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rasm (URL)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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

export default NewsForm

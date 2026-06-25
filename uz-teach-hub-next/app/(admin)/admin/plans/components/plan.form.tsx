"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { planSchema } from "@/lib/validation"
import { usePlansStore } from "@/stores/plans.store"
import { FormProps, IPlan } from "@/types"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

function PlanForm({ type, updateData, closeAction }: FormProps<IPlan>) {
  const { add, update } = usePlansStore()

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: updateData?.title ?? "",
      code: updateData?.code ?? "",
      description: updateData?.description ?? "",
      price: updateData?.price ?? 0,
      duration_days: updateData?.duration_days ?? 30,
      is_active: updateData?.is_active ?? true,
    },
  })

  const onSubmit = async (data: z.infer<typeof planSchema>) => {
    const promise = type === "POST" ? add(data) : update(updateData.id, data)
    toast.promise(promise, {
      loading: "Saqlanmoqda...",
      success: type === "POST" ? "Tarif qo'shildi." : "Tarif yangilandi.",
      error: "Xatolik yuz berdi!",
    })
    await promise
    form.reset()
    closeAction?.()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif nomi</FormLabel>
                <FormControl>
                  <Input placeholder="Masalan: Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kod</FormLabel>
                <FormControl>
                  <Input placeholder="premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Narx (so'm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muddat (kun)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="m-0">Faol</FormLabel>
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

export default PlanForm

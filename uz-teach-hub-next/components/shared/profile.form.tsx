"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { profileSchema } from "@/lib/validation"
import { useAuth } from "@/hooks/useAuth"
import APIServiceController from "@/service/service.controller"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

/** Reusable profile editor — used by both admin and student profile pages. */
function ProfileForm() {
  const { user, loading } = useAuth()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: "", phone: "" },
  })

  useEffect(() => {
    if (!user) return
    APIServiceController.fetch<{ full_name: string | null; phone: string | null }>(
      (db) => db.from("profiles").select("full_name, phone").eq("id", user.id).single() as never,
      (data) => {
        if (data) form.reset({ full_name: data.full_name ?? "", phone: data.phone ?? "" })
      }
    )
  }, [user, form])

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return
    const promise = (async () => {
      const { error } = await APIServiceController.db.from("profiles").update(data).eq("id", user.id)
      if (error) throw new Error(error.message)
    })()
    toast.promise(promise, { loading: "Saqlanmoqda...", success: "Profil yangilandi.", error: "Xatolik!" })
  }

  if (loading) return <Skeleton className="h-40 w-full" />

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-3">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ism familiya</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-1 self-start">
          Saqlash
        </Button>
      </form>
    </FormProvider>
  )
}

export default ProfileForm

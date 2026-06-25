"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { feedbackSchema } from "@/lib/validation"
import { feedbackTypeOptions } from "@/constants"
import APIServiceController from "@/service/service.controller"
import { useAuth } from "@/hooks/useAuth"
import { IFeedback } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

function useFeedbackPresenter() {
  const { user } = useAuth()
  const [items, setItems] = useState<IFeedback[]>([])

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { type: "suggestion", subject: "", message: "" },
  })

  const load = () => {
    if (!user) return
    APIServiceController.fetch<IFeedback[]>(
      (db) =>
        db
          .from("feedback")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }) as never,
      (data) => setItems(data ?? [])
    )
  }

  useEffect(load, [user])

  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    if (!user) return
    const promise = (async () => {
      const { error } = await APIServiceController.db
        .from("feedback")
        .insert({ ...data, user_id: user.id })
      if (error) throw new Error(error.message)
    })()
    toast.promise(promise, { loading: "Yuborilmoqda...", success: "Murojaat yuborildi.", error: "Xatolik!" })
    await promise
    form.reset()
    load()
  }

  return { form, onSubmit, items }
}

function FeedbackPresenter() {
  const { form, onSubmit, items } = useFeedbackPresenter()

  return (
    <Container>
      <Topbar title="Takliflar" desc="Savol, taklif yoki xatolik haqida yozing." />

      <Section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turi</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {feedbackTypeOptions.map((o) => (
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mavzu</FormLabel>
                      <FormControl>
                        <Input placeholder="Qisqacha mavzu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xabar</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Batafsil yozing..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="self-start">
                  Yuborish
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Mening murojaatlarim</h2>
          {items.length === 0 && (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Hozircha murojaatlar yo'q.
            </p>
          )}
          {items.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{f.subject}</p>
                  <Badge variant="outline">{f.type}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.message}</p>
                {f.admin_reply && (
                  <div className="mt-2 rounded-lg bg-primary/5 p-3 text-sm">
                    <span className="font-medium">Javob: </span>
                    {f.admin_reply}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </Container>
  )
}

export default FeedbackPresenter

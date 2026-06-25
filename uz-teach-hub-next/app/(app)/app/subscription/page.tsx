"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Check, CreditCard } from "lucide-react"

import APIServiceController from "@/service/service.controller"
import { useAuth } from "@/hooks/useAuth"
import { IPaymentCard, IPlan } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

function useSubscriptionPresenter() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<IPlan[]>([])
  const [cards, setCards] = useState<IPaymentCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    APIServiceController.fetch<IPlan[]>(
      (db) =>
        db.from("plans").select("*").eq("is_active", true).order("sort_order", { ascending: true }) as never,
      (data) => {
        setPlans(data ?? [])
        setLoading(false)
      }
    )
    APIServiceController.fetch<IPaymentCard[]>(
      (db) => db.from("payment_cards").select("*").eq("is_active", true) as never,
      (data) => setCards(data ?? [])
    )
  }, [])

  const buy = (plan: IPlan) => {
    if (!user) return
    const promise = (async () => {
      const { error } = await APIServiceController.db.from("payments").insert({
        user_id: user.id,
        plan_id: plan.id,
        amount: plan.price,
        status: "pending",
      })
      if (error) throw new Error(error.message)
    })()
    toast.promise(promise, {
      loading: "So'rov yuborilmoqda...",
      success: "To'lov so'rovi yuborildi. Admin tasdiqlashini kuting.",
      error: "Xatolik yuz berdi!",
    })
  }

  return { plans, cards, loading, buy }
}

function SubscriptionPresenter() {
  const { plans, cards, loading, buy } = useSubscriptionPresenter()

  return (
    <Container>
      <Topbar title="Tarif va to'lov" desc="O'zingizga mos tarifni tanlang." />

      <Section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)
          : plans.map((p) => (
              <Card key={p.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-4 text-3xl font-bold">
                    {p.price.toLocaleString("uz")}{" "}
                    <span className="text-base font-normal text-muted-foreground">so'm</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.duration_days} kun</p>
                  <Button className="mt-6 w-full" onClick={() => buy(p)}>
                    <Check className="size-4" /> Tanlash
                  </Button>
                </CardContent>
              </Card>
            ))}
      </Section>

      {cards.length > 0 && (
        <Section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">To'lov uchun kartalar</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/5">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{c.card_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.holder_name} {c.bank && <Badge variant="outline" className="ml-1">{c.bank}</Badge>}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </Container>
  )
}

export default SubscriptionPresenter

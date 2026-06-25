"use client"

import { useEffect, useState } from "react"
import { BookOpen, Users, Wallet, CreditCard } from "lucide-react"
import APIServiceController from "@/service/service.controller"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"

interface IStats {
  students: number
  courses: number
  pendingPayments: number
  plans: number
}

/* --------------------------- presenter hook --------------------------- */
function useDashboardPresenter() {
  const [stats, setStats] = useState<IStats | null>(null)

  useEffect(() => {
    ;(async () => {
      const [students, courses, pendingPayments, plans] = await Promise.all([
        APIServiceController.count("profiles"),
        APIServiceController.count("courses"),
        APIServiceController.count("payments", (q) => q.eq("status", "pending")),
        APIServiceController.count("plans"),
      ])
      setStats({ students, courses, pendingPayments, plans })
    })()
  }, [])

  return { stats }
}

/* ------------------------------ component ----------------------------- */
const cards = [
  { key: "students", title: "O'quvchilar", icon: Users },
  { key: "courses", title: "Kurslar", icon: BookOpen },
  { key: "pendingPayments", title: "Kutilayotgan to'lovlar", icon: Wallet },
  { key: "plans", title: "Tariflar", icon: CreditCard },
] as const

function AdminDashboardPresenter() {
  const { stats } = useDashboardPresenter()

  return (
    <Container>
      <Topbar title="Dashboard" desc="Platforma ko'rsatkichlari va boshqaruv." />

      <Section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ key, title, icon: Icon }) => (
          <Card key={key}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                {stats ? (
                  <p className="mt-1 text-3xl font-bold">{stats[key]}</p>
                ) : (
                  <Skeleton className="mt-2 h-8 w-16" />
                )}
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/5">
                <Icon className="size-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </Section>
    </Container>
  )
}

export default AdminDashboardPresenter

"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

import APIServiceController from "@/service/service.controller"
import { useAuth } from "@/hooks/useAuth"
import { INotification } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function useNotificationsPresenter() {
  const { user } = useAuth()
  const [items, setItems] = useState<INotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    APIServiceController.fetch<INotification[]>(
      (db) =>
        db
          .from("notifications")
          .select("*")
          .or(`user_id.is.null,user_id.eq.${user.id}`)
          .order("created_at", { ascending: false }) as never,
      (data) => {
        setItems(data ?? [])
        setLoading(false)
      }
    )
  }, [user])

  return { items, loading }
}

function NotificationsPresenter() {
  const { items, loading } = useNotificationsPresenter()

  return (
    <Container>
      <Topbar title="Bildirishnomalar" desc="Eng so'nggi yangiliklar va e'lonlar." />
      <Section className="mt-8 space-y-3">
        {loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}

        {!loading &&
          items.map((n) => (
            <Card key={n.id}>
              <CardContent className="flex gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                  <Bell className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{n.title}</p>
                  {n.body && <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString("uz")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

        {!loading && items.length === 0 && (
          <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            Bildirishnomalar yo'q.
          </p>
        )}
      </Section>
    </Container>
  )
}

export default NotificationsPresenter

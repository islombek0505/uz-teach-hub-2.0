"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { usePaymentsStore } from "@/stores/payments.store"
import { IPayment } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { TableCreator } from "@/components/creators/table.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Kutilmoqda", variant: "secondary" },
  approved: { label: "Tasdiqlangan", variant: "default" },
  rejected: { label: "Rad etilgan", variant: "destructive" },
}

function usePaymentsPagePresenter() {
  const { data: payments, loading, fetch, update } = usePaymentsStore()
  useEffect(() => {
    fetch()
  }, [])

  const review = (id: string, status: "approved" | "rejected") =>
    toast.promise(update(id, { status, reviewed_at: new Date().toISOString() }), {
      loading: "Saqlanmoqda...",
      success: status === "approved" ? "To'lov tasdiqlandi." : "To'lov rad etildi.",
      error: "Xatolik yuz berdi!",
    })

  return { payments, loading, review }
}

function PaymentsPagePresenter() {
  const { payments, loading, review } = usePaymentsPagePresenter()

  return (
    <Container>
      <Topbar title="To'lovlar" desc={loading ? "Yuklanmoqda..." : `${payments.length} ta to'lov`} />
      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<IPayment>
          tableData={payments}
          loading={loading}
          headerData={["No", "To'lovchi", "Summa", "Holat", "Sana", ""]}
          renderRow={(p, i) => {
            const badge = statusBadge[p.status] ?? statusBadge.pending
            return (
              <TableRow key={p.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium">{p.payer_name ?? "—"}</TableCell>
                <TableCell>{p.amount?.toLocaleString("uz")} so'm</TableCell>
                <TableCell>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </TableCell>
                <TableCell>{new Date(p.created_at).toLocaleDateString("uz")}</TableCell>
                <TableCell>
                  <TableActionsCreator
                    actions={[
                      { name: "Tasdiqlash", action: () => review(p.id, "approved") },
                      { name: "Rad etish", action: () => review(p.id, "rejected"), danger: true },
                    ]}
                  />
                </TableCell>
              </TableRow>
            )
          }}
        />
      </Section>
    </Container>
  )
}

export default PaymentsPagePresenter

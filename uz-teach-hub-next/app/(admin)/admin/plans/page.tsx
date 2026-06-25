"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { usePlansStore } from "@/stores/plans.store"
import { IPlan } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { DialogCreator } from "@/components/creators/dialog.creator"
import { SheetCreator } from "@/components/creators/sheet.creator"
import { TableCreator } from "@/components/creators/table.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"
import PlanForm from "./components/plan.form"

function usePlansPagePresenter() {
  const { data: plans, loading, fetch, remove } = usePlansStore()
  const [open, setOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [current, setCurrent] = useState<IPlan | null>(null)

  useEffect(() => {
    fetch()
  }, [])

  const deleteAction = useCallback(
    (id: string) =>
      toast.promise(remove(id), {
        loading: "O'chirilmoqda...",
        success: "Tarif o'chirildi.",
        error: "Xatolik yuz berdi!",
      }),
    [remove]
  )

  const updateAction = (plan: IPlan) => {
    setCurrent(plan)
    setSheetOpen(true)
  }

  return { plans, loading, open, setOpen, sheetOpen, setSheetOpen, current, updateAction, deleteAction }
}

function PlansPagePresenter() {
  const { plans, loading, open, setOpen, sheetOpen, setSheetOpen, current, updateAction, deleteAction } =
    usePlansPagePresenter()

  return (
    <Container>
      <Topbar
        title="Tariflar"
        desc={loading ? "Yuklanmoqda..." : `${plans.length} ta tarif`}
        action={
          <DialogCreator
            triggerText="Yangi tarif"
            triggerIcon={<Plus className="size-4" />}
            open={open}
            setOpen={setOpen}
            title="Yangi tarif yaratish"
            desc="Tarif ma'lumotlarini to'ldiring"
          >
            <PlanForm type="POST" closeAction={() => setOpen(false)} />
          </DialogCreator>
        }
      />

      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<IPlan>
          tableData={plans}
          loading={loading}
          headerData={["No", "Nomi", "Kod", "Narx", "Muddat", "Holat", ""]}
          renderRow={(p, i) => (
            <TableRow key={p.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>{p.code}</TableCell>
              <TableCell>{p.price?.toLocaleString("uz")} so'm</TableCell>
              <TableCell>{p.duration_days} kun</TableCell>
              <TableCell>
                <Badge variant={p.is_active ? "default" : "outline"}>
                  {p.is_active ? "Faol" : "Nofaol"}
                </Badge>
              </TableCell>
              <TableCell>
                <TableActionsCreator
                  actions={[
                    { name: "O'zgartirish", action: () => updateAction(p) },
                    { name: "O'chirish", action: () => deleteAction(p.id), danger: true },
                  ]}
                />
              </TableCell>
            </TableRow>
          )}
        />
      </Section>

      {current && (
        <SheetCreator
          title="Tarifni yangilash"
          desc="Tarif ma'lumotlarini o'zgartiring"
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
        >
          <PlanForm type="UPDATE" updateData={current} closeAction={() => setSheetOpen(false)} />
        </SheetCreator>
      )}
    </Container>
  )
}

export default PlansPagePresenter

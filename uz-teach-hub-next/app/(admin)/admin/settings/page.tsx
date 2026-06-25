"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { usePaymentCardsStore } from "@/stores/payment-cards.store"
import { IPaymentCard } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { DialogCreator } from "@/components/creators/dialog.creator"
import { TableCreator } from "@/components/creators/table.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"

function useSettingsPagePresenter() {
  const { data: cards, loading, fetch, add, update, remove } = usePaymentCardsStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ label: "", holder_name: "", card_number: "", bank: "" })

  useEffect(() => {
    fetch()
  }, [])

  const create = async () => {
    if (!form.card_number.trim()) return
    const promise = add({ ...form, is_active: true, sort_order: cards.length })
    toast.promise(promise, { loading: "Qo'shilmoqda...", success: "Karta qo'shildi.", error: "Xatolik!" })
    await promise
    setForm({ label: "", holder_name: "", card_number: "", bank: "" })
    setOpen(false)
  }

  const toggle = (c: IPaymentCard) =>
    toast.promise(update(c.id, { is_active: !c.is_active }), {
      loading: "Saqlanmoqda...",
      success: "Yangilandi.",
      error: "Xatolik!",
    })

  const deleteAction = useCallback(
    (id: string) =>
      toast.promise(remove(id), { loading: "O'chirilmoqda...", success: "O'chirildi.", error: "Xatolik!" }),
    [remove]
  )

  return { cards, loading, open, setOpen, form, setForm, create, toggle, deleteAction }
}

function SettingsPagePresenter() {
  const { cards, loading, open, setOpen, form, setForm, create, toggle, deleteAction } =
    useSettingsPagePresenter()

  return (
    <Container>
      <Topbar
        title="Sozlamalar"
        desc="To'lov kartalari va platforma sozlamalari."
        action={
          <DialogCreator
            triggerText="Karta qo'shish"
            triggerIcon={<Plus className="size-4" />}
            open={open}
            setOpen={setOpen}
            title="To'lov kartasi"
            desc="Karta ma'lumotlarini kiriting"
          >
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Nomi (masalan: Asosiy karta)"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
              <Input
                placeholder="Karta egasi"
                value={form.holder_name}
                onChange={(e) => setForm({ ...form, holder_name: e.target.value })}
              />
              <Input
                placeholder="Karta raqami"
                value={form.card_number}
                onChange={(e) => setForm({ ...form, card_number: e.target.value })}
              />
              <Input
                placeholder="Bank"
                value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={create}>Qo'shish</Button>
              </div>
            </div>
          </DialogCreator>
        }
      />

      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<IPaymentCard>
          tableData={cards}
          loading={loading}
          headerData={["No", "Nomi", "Egasi", "Karta raqami", "Holat", ""]}
          renderRow={(c, i) => (
            <TableRow key={c.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="font-medium">{c.label}</TableCell>
              <TableCell>{c.holder_name}</TableCell>
              <TableCell>{c.card_number}</TableCell>
              <TableCell>
                <Badge variant={c.is_active ? "default" : "outline"}>
                  {c.is_active ? "Faol" : "Nofaol"}
                </Badge>
              </TableCell>
              <TableCell>
                <TableActionsCreator
                  actions={[
                    { name: c.is_active ? "Nofaol qilish" : "Faollashtirish", action: () => toggle(c) },
                    { name: "O'chirish", action: () => deleteAction(c.id), danger: true },
                  ]}
                />
              </TableCell>
            </TableRow>
          )}
        />
      </Section>
    </Container>
  )
}

export default SettingsPagePresenter

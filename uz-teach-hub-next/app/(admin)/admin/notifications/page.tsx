"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { useNotificationsStore } from "@/stores/notifications.store"
import { INotification } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { DialogCreator } from "@/components/creators/dialog.creator"
import { TableCreator } from "@/components/creators/table.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"

function useNotificationsPagePresenter() {
  const { data: items, loading, fetch, add, remove } = useNotificationsStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    fetch()
  }, [])

  const create = async () => {
    if (!title.trim()) return
    const promise = add({ title: title.trim(), body, type: "broadcast", user_id: null })
    toast.promise(promise, { loading: "Yuborilmoqda...", success: "Bildirishnoma yuborildi.", error: "Xatolik!" })
    await promise
    setTitle("")
    setBody("")
    setOpen(false)
  }

  const deleteAction = useCallback(
    (id: string) =>
      toast.promise(remove(id), { loading: "O'chirilmoqda...", success: "O'chirildi.", error: "Xatolik!" }),
    [remove]
  )

  return { items, loading, open, setOpen, title, setTitle, body, setBody, create, deleteAction }
}

function NotificationsPagePresenter() {
  const { items, loading, open, setOpen, title, setTitle, body, setBody, create, deleteAction } =
    useNotificationsPagePresenter()

  return (
    <Container>
      <Topbar
        title="Bildirishnomalar"
        desc={loading ? "Yuklanmoqda..." : `${items.length} ta bildirishnoma`}
        action={
          <DialogCreator
            triggerText="Yangi bildirishnoma"
            triggerIcon={<Plus className="size-4" />}
            open={open}
            setOpen={setOpen}
            title="Bildirishnoma yuborish"
            desc="Barcha foydalanuvchilarga yuboriladi"
          >
            <div className="flex flex-col gap-3">
              <Input placeholder="Sarlavha" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea rows={3} placeholder="Matn" value={body} onChange={(e) => setBody(e.target.value)} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Bekor qilish
                </Button>
                <Button onClick={create}>Yuborish</Button>
              </div>
            </div>
          </DialogCreator>
        }
      />

      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<INotification>
          tableData={items}
          loading={loading}
          headerData={["No", "Sarlavha", "Turi", "Sana", ""]}
          renderRow={(n, i) => (
            <TableRow key={n.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="font-medium">{n.title}</TableCell>
              <TableCell>{n.type}</TableCell>
              <TableCell>{new Date(n.created_at).toLocaleDateString("uz")}</TableCell>
              <TableCell>
                <TableActionsCreator
                  actions={[{ name: "O'chirish", action: () => deleteAction(n.id), danger: true }]}
                />
              </TableCell>
            </TableRow>
          )}
        />
      </Section>
    </Container>
  )
}

export default NotificationsPagePresenter

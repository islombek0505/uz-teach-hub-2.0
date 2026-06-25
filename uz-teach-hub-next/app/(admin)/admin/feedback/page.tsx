"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { useFeedbackStore } from "@/stores/feedback.store"
import { IFeedback } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { TableCreator } from "@/components/creators/table.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"
import { SheetCreator } from "@/components/creators/sheet.creator"

function useFeedbackPagePresenter() {
  const { data: items, loading, fetch, update } = useFeedbackStore()
  const [current, setCurrent] = useState<IFeedback | null>(null)
  const [reply, setReply] = useState("")

  useEffect(() => {
    fetch()
  }, [])

  const openReply = (item: IFeedback) => {
    setCurrent(item)
    setReply(item.admin_reply ?? "")
    if (!item.read) update(item.id, { read: true })
  }

  const sendReply = async () => {
    if (!current) return
    const promise = update(current.id, { admin_reply: reply, read: true })
    toast.promise(promise, { loading: "Yuborilmoqda...", success: "Javob saqlandi.", error: "Xatolik!" })
    await promise
    setCurrent(null)
  }

  return { items, loading, current, setCurrent, reply, setReply, openReply, sendReply }
}

function FeedbackPagePresenter() {
  const { items, loading, current, setCurrent, reply, setReply, openReply, sendReply } =
    useFeedbackPagePresenter()

  return (
    <Container>
      <Topbar title="Takliflar" desc={loading ? "Yuklanmoqda..." : `${items.length} ta murojaat`} />
      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<IFeedback>
          tableData={items}
          loading={loading}
          headerData={["No", "Mavzu", "Turi", "Holat", "Sana", ""]}
          renderRow={(f, i) => (
            <TableRow key={f.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="max-w-xs truncate font-medium">{f.subject}</TableCell>
              <TableCell>{f.type}</TableCell>
              <TableCell>
                <Badge variant={f.read ? "outline" : "default"}>{f.read ? "O'qilgan" : "Yangi"}</Badge>
              </TableCell>
              <TableCell>{new Date(f.created_at).toLocaleDateString("uz")}</TableCell>
              <TableCell>
                <TableActionsCreator actions={[{ name: "Ko'rish / Javob", action: () => openReply(f) }]} />
              </TableCell>
            </TableRow>
          )}
        />
      </Section>

      {current && (
        <SheetCreator
          title={current.subject}
          desc="Foydalanuvchi murojaatiga javob bering"
          sheetOpen={!!current}
          setSheetOpen={(o) => !o && setCurrent(null)}
        >
          <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-muted/40 p-3 text-sm">{current.message}</div>
            <Textarea
              rows={4}
              placeholder="Javobingizni yozing..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCurrent(null)}>
                Yopish
              </Button>
              <Button onClick={sendReply}>Javobni saqlash</Button>
            </div>
          </div>
        </SheetCreator>
      )}
    </Container>
  )
}

export default FeedbackPagePresenter

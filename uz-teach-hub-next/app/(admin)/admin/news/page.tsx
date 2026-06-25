"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { useNewsStore } from "@/stores/news.store"
import { INews } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { DialogCreator } from "@/components/creators/dialog.creator"
import { SheetCreator } from "@/components/creators/sheet.creator"
import { TableCreator } from "@/components/creators/table.creator"
import { TableActionsCreator } from "@/components/creators/table.action.creator"
import NewsForm from "./components/news.form"

function useNewsPagePresenter() {
  const { data: news, loading, fetch, remove } = useNewsStore()
  const [open, setOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [current, setCurrent] = useState<INews | null>(null)

  useEffect(() => {
    fetch()
  }, [])

  const deleteAction = useCallback(
    (id: string) =>
      toast.promise(remove(id), {
        loading: "O'chirilmoqda...",
        success: "Yangilik o'chirildi.",
        error: "Xatolik yuz berdi!",
      }),
    [remove]
  )

  const updateAction = (item: INews) => {
    setCurrent(item)
    setSheetOpen(true)
  }

  return { news, loading, open, setOpen, sheetOpen, setSheetOpen, current, updateAction, deleteAction }
}

function NewsPagePresenter() {
  const { news, loading, open, setOpen, sheetOpen, setSheetOpen, current, updateAction, deleteAction } =
    useNewsPagePresenter()

  return (
    <Container>
      <Topbar
        title="Yangiliklar"
        desc={loading ? "Yuklanmoqda..." : `${news.length} ta yangilik`}
        action={
          <DialogCreator
            triggerText="Yangi yangilik"
            triggerIcon={<Plus className="size-4" />}
            open={open}
            setOpen={setOpen}
            title="Yangilik qo'shish"
            desc="Yangilik ma'lumotlarini to'ldiring"
          >
            <NewsForm type="POST" closeAction={() => setOpen(false)} />
          </DialogCreator>
        }
      />

      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<INews>
          tableData={news}
          loading={loading}
          headerData={["No", "Sarlavha", "Bo'lim", "Holat", "Sana", ""]}
          renderRow={(n, i) => (
            <TableRow key={n.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="max-w-xs truncate font-medium">{n.title}</TableCell>
              <TableCell>{n.category}</TableCell>
              <TableCell>
                <Badge variant={n.published ? "default" : "outline"}>
                  {n.published ? "Chop etilgan" : "Qoralama"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(n.published_at).toLocaleDateString("uz")}</TableCell>
              <TableCell>
                <TableActionsCreator
                  actions={[
                    { name: "O'zgartirish", action: () => updateAction(n) },
                    { name: "O'chirish", action: () => deleteAction(n.id), danger: true },
                  ]}
                />
              </TableCell>
            </TableRow>
          )}
        />
      </Section>

      {current && (
        <SheetCreator
          title="Yangilikni tahrirlash"
          desc="Ma'lumotlarni o'zgartiring"
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
        >
          <NewsForm type="UPDATE" updateData={current} closeAction={() => setSheetOpen(false)} />
        </SheetCreator>
      )}
    </Container>
  )
}

export default NewsPagePresenter

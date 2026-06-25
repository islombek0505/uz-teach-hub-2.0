"use client"

import { useEffect, useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import APIServiceController from "@/service/service.controller"
import { IProfile } from "@/types"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { TableCreator } from "@/components/creators/table.creator"

interface IStudentStat extends IProfile {
  completed: number
}

function useStudentStatsPresenter() {
  const [rows, setRows] = useState<IStudentStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      let students: IProfile[] = []
      let progress: { user_id: string; completed: boolean }[] = []

      await APIServiceController.fetch<IProfile[]>(
        (db) => db.from("profiles").select("*").order("created_at", { ascending: false }) as never,
        (data) => (students = data ?? [])
      )
      await APIServiceController.fetch<{ user_id: string; completed: boolean }[]>(
        (db) => db.from("lesson_progress").select("user_id, completed").eq("completed", true) as never,
        (data) => (progress = data ?? [])
      )

      const counts = progress.reduce<Record<string, number>>((acc, p) => {
        acc[p.user_id] = (acc[p.user_id] ?? 0) + 1
        return acc
      }, {})

      setRows(students.map((s) => ({ ...s, completed: counts[s.id] ?? 0 })))
      setLoading(false)
    })()
  }, [])

  return { rows, loading }
}

function StudentStatsPresenter() {
  const { rows, loading } = useStudentStatsPresenter()

  return (
    <Container>
      <Topbar title="O'quvchilar statistikasi" desc="Tugatilgan darslar bo'yicha faollik." />
      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator<IStudentStat>
          tableData={rows}
          loading={loading}
          headerData={["No", "Ism familiya", "Telefon", "Tugatilgan darslar"]}
          renderRow={(s, i) => (
            <TableRow key={s.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="font-medium">{s.full_name ?? "—"}</TableCell>
              <TableCell>{s.phone ?? "—"}</TableCell>
              <TableCell>{s.completed}</TableCell>
            </TableRow>
          )}
        />
      </Section>
    </Container>
  )
}

export default StudentStatsPresenter

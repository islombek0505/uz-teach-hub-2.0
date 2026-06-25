"use client"

import { useEffect } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { useStudentsStore } from "@/stores/students.store"
import Container from "@/components/shared/container"
import Section from "@/components/shared/section"
import Topbar from "@/components/shared/topbar"
import { TableCreator } from "@/components/creators/table.creator"

function useStudentsPagePresenter() {
  const { data: students, loading, fetch } = useStudentsStore()
  useEffect(() => {
    fetch()
  }, [])
  return { students, loading }
}

function StudentsPagePresenter() {
  const { students, loading } = useStudentsPagePresenter()

  return (
    <Container>
      <Topbar
        title="O'quvchilar"
        desc={loading ? "Yuklanmoqda..." : `${students.length} ta o'quvchi`}
      />
      <Section className="mt-8 rounded-3xl bg-white p-4 shadow-sm">
        <TableCreator
          tableData={students}
          loading={loading}
          headerData={["No", "Ism familiya", "Telefon", "Shahar", "Ro'yxatdan o'tgan"]}
          renderRow={(s, i) => (
            <TableRow key={s.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="font-medium">{s.full_name ?? "—"}</TableCell>
              <TableCell>{s.phone ?? "—"}</TableCell>
              <TableCell>{s.city ?? "—"}</TableCell>
              <TableCell>{new Date(s.created_at).toLocaleDateString("uz")}</TableCell>
            </TableRow>
          )}
        />
      </Section>
    </Container>
  )
}

export default StudentsPagePresenter

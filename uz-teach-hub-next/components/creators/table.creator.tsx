"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReactNode } from "react"

interface ITableHeaderData {
  headerData: string[]
}

interface ITableBodyCreator<T> {
  tableData: T[]
  renderRow: (item: T, index: number) => ReactNode
}

interface ITableCreatorProps<T> extends ITableHeaderData, ITableBodyCreator<T> {
  loading: boolean
  emptyText?: string
}

function TableHeaderCreator({ headerData }: ITableHeaderData) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        {headerData.map((header) => (
          <TableHead key={header} className="h-12">
            {header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}

function TableSkeleton({ headerData }: ITableHeaderData) {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, row) => (
        <TableRow key={row}>
          {headerData.map((header) => (
            <TableCell key={header}>
              <Skeleton className="h-8 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

function TableBodyCreator<T>({ tableData, renderRow }: ITableBodyCreator<T>) {
  return <TableBody>{tableData.map((data, index) => renderRow(data, index))}</TableBody>
}

function TableBodyEmpty({ headerData, emptyText }: ITableHeaderData & { emptyText?: string }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={headerData.length} className="py-8 text-center text-muted-foreground">
          {emptyText ?? "Ma'lumot mavjud emas"}
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

/**
 * TableCreator — data-driven table. Pass header labels, rows, a `renderRow`
 * and a `loading` flag; it handles skeleton + empty states automatically.
 * Ported from clone-app1 (keyed on `id` to match Supabase rows).
 */
export function TableCreator<T extends { id: string }>({
  tableData,
  loading,
  headerData,
  renderRow,
  emptyText,
}: ITableCreatorProps<T>) {
  return (
    <Table className="mb-4">
      <TableHeaderCreator headerData={headerData} />
      {loading ? (
        <TableSkeleton headerData={headerData} />
      ) : tableData.length > 0 ? (
        <TableBodyCreator tableData={tableData} renderRow={renderRow} />
      ) : (
        <TableBodyEmpty headerData={headerData} emptyText={emptyText} />
      )}
    </Table>
  )
}

import { create } from "zustand"
import type { SupabaseClient } from "@supabase/supabase-js"
import { supabaseBrowser } from "@/lib/supabase/client"
import { useNetworkService } from "@/hooks/useNetworkService"

/**
 * createStoreCreator — the dynamic heart of the architecture.
 *
 * Give it a table config and it returns a fully-working Zustand CRUD store:
 * `{ data, loading, err, fetch, add, update, remove, setData }`. Every entity
 * store in `stores/` is then a SINGLE line — exactly like clone-app1, but the
 * transport is Supabase instead of REST.
 *
 *   export const useCoursesStore = createStoreCreator<ICourse, ICreateCourse>({
 *     table: "courses",
 *     orderBy: { column: "created_at", ascending: false },
 *   })
 */

export interface IBaseStore<Row, Insert, Update> {
  data: Row[]
  loading: boolean
  err: string | null
  fetch: () => Promise<void>
  add: (payload: Insert) => Promise<Row | null>
  update: (id: string, payload: Update) => Promise<Row | null>
  remove: (id: string) => Promise<void>
  setData: (rows: Row[]) => void
}

export interface ITableConfig {
  /** Supabase table name. */
  table: string
  /** Columns / embedded relations to select. Defaults to "*". */
  select?: string
  /** Default ordering applied on fetch. */
  orderBy?: { column: string; ascending?: boolean }
  /** Primary key column. Defaults to "id". */
  idColumn?: string
}

/**
 * The generic factory works over *dynamic* table names, so it uses an
 * untyped view of the client. Page code that needs row-level type-safety
 * goes through APIServiceController with literal table names instead.
 */
type Result<T> = PromiseLike<{ data: T | null; error: { message: string } | null }>
const anyDb = () => supabaseBrowser() as unknown as SupabaseClient

export function createStoreCreator<Row, Insert = Partial<Row>, Update = Partial<Row>>(
  config: ITableConfig
) {
  const idColumn = config.idColumn ?? "id"
  const select = config.select ?? "*"
  const id = (r: Row) => (r as Record<string, unknown>)[idColumn]

  return create<IBaseStore<Row, Insert, Update>>()((set, get) => ({
    data: [],
    loading: false,
    err: null,

    setData: (rows) => set({ data: rows }),

    fetch: async () => {
      set({ loading: true, err: null })
      await useNetworkService<Row[]>({
        query: () => {
          let q = anyDb().from(config.table).select(select)
          if (config.orderBy) {
            q = q.order(config.orderBy.column, { ascending: config.orderBy.ascending ?? false })
          }
          return q as unknown as Result<Row[]>
        },
        action: (data, error) => {
          if (data) set({ data })
          if (error) set({ err: error.message })
          set({ loading: false })
        },
      })
    },

    add: async (payload) => {
      let created: Row | null = null
      await useNetworkService<Row>({
        query: () =>
          anyDb()
            .from(config.table)
            .insert(payload as never)
            .select(select)
            .single() as unknown as Result<Row>,
        action: (data, error) => {
          if (error) {
            set({ err: error.message })
            throw new Error(error.message)
          }
          if (data) {
            created = data
            set((s) => ({ data: [data, ...s.data] }))
          }
        },
      })
      return created
    },

    update: async (rowId, payload) => {
      let updated: Row | null = null
      await useNetworkService<Row>({
        query: () =>
          anyDb()
            .from(config.table)
            .update(payload as never)
            .eq(idColumn, rowId)
            .select(select)
            .single() as unknown as Result<Row>,
        action: (data, error) => {
          if (error) {
            set({ err: error.message })
            throw new Error(error.message)
          }
          if (data) {
            updated = data
            set((s) => ({ data: s.data.map((r) => (id(r) === rowId ? data : r)) }))
          }
        },
      })
      return updated
    },

    remove: async (rowId) => {
      await useNetworkService<null>({
        query: () =>
          anyDb().from(config.table).delete().eq(idColumn, rowId) as unknown as Result<null>,
        action: (_data, error) => {
          if (error) {
            set({ err: error.message })
            throw new Error(error.message)
          }
          set((s) => ({ data: s.data.filter((r) => id(r) !== rowId) }))
        },
      })
    },
  }))
}

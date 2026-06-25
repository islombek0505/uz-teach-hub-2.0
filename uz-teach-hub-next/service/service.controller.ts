import { supabaseBrowser } from "@/lib/supabase/client"
import { useNetworkService } from "@/hooks/useNetworkService"

/**
 * APIServiceController — static façade over Supabase for everything that does
 * NOT fit the plain-CRUD store (joins, signed storage URLs, RPC, custom
 * filters). Mirrors clone-app1's controller so pages keep one calling style:
 *
 *   APIServiceController.fetch(q => q.from("courses").select("*, lessons(count)"),
 *     (data, error) => { ... })
 */
type QueryBuilder<T> = (db: ReturnType<typeof supabaseBrowser>) => PromiseLike<{
  data: T | null
  error: { message: string } | null
}>

class APIServiceController {
  static get db() {
    return supabaseBrowser()
  }

  /** Run an arbitrary read query built from the Supabase client. */
  static async fetch<T>(
    build: QueryBuilder<T>,
    action: (data: T | null, error: Error | null) => void
  ) {
    await useNetworkService<T>({
      query: () => build(supabaseBrowser()),
      action,
    })
  }

  /** Call a Postgres function (RPC). */
  static async rpc<T>(
    fn: string,
    args: Record<string, unknown>,
    action: (data: T | null, error: Error | null) => void
  ) {
    await useNetworkService<T>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query: () => supabaseBrowser().rpc(fn as any, args) as any,
      action,
    })
  }

  /** Count rows in a table (optionally filtered via a builder). */
  static async count(
    table: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    build?: (q: any) => any
  ): Promise<number> {
    // Dynamic table name → use the untyped view of the client.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = (supabaseBrowser() as any).from(table).select("*", { count: "exact", head: true })
    if (build) q = build(q)
    const { count } = await q
    return count ?? 0
  }

  /** Create a temporary signed URL for a private storage object. */
  static async signedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600
  ): Promise<string | null> {
    const { data } = await supabaseBrowser()
      .storage.from(bucket)
      .createSignedUrl(path, expiresIn)
    return data?.signedUrl ?? null
  }

  /** Upload a file to a storage bucket and return its stored path. */
  static async upload(bucket: string, path: string, file: File): Promise<string> {
    const { error } = await supabaseBrowser()
      .storage.from(bucket)
      .upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    return path
  }
}

export default APIServiceController

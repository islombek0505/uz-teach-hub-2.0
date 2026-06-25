/**
 * Network primitive — the single place every request resolves through.
 *
 * In clone-app1 this wrapped `fetch(localhost:3333/...)`. Here it wraps any
 * Supabase query thunk, but keeps the exact same ergonomics: you pass a query
 * and an `action(data, error)` callback. Stores and the service controller are
 * built on top of this, so the whole app shares one consistent result shape.
 */

export type SupaResult<T> = {
  data: T | null
  error: { message: string } | null
}

type NetworkServiceProps<T> = {
  /** A thunk that runs a Supabase query and returns `{ data, error }`. */
  query: () => PromiseLike<SupaResult<T>>
  action: (data: T | null, error: Error | null) => void
}

export async function useNetworkService<T>({ query, action }: NetworkServiceProps<T>) {
  try {
    const { data, error } = await query()

    if (error) {
      action(null, new Error(error.message))
      return
    }
    action(data, null)
  } catch (error) {
    action(null, error instanceof Error ? error : new Error("Unknown error"))
  }
}

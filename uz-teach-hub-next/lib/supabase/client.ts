import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

/**
 * Browser-side Supabase client (singleton).
 *
 * This is the data backend the whole app talks to. The store-factory
 * (`stores/store.creator.ts`) and the service controller
 * (`service/service.controller.ts`) both build on top of this — pages never
 * touch `supabaseBrowser()` directly, they go through a store or the controller.
 */
let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function supabaseBrowser() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

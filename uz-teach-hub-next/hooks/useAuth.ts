"use client"

import { useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabaseBrowser } from "@/lib/supabase/client"
import type { AppRole } from "@/lib/auth"

interface UseAuthResult {
  session: Session | null
  user: User | null
  role: AppRole | null
  loading: boolean
}

/** Reactive auth state — session + resolved role. Mirrors the TanStack app. */
export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<AppRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = supabaseBrowser()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user) {
      setRole(null)
      return
    }
    supabaseBrowser()
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .then(({ data }) => {
        const roles = (data ?? []).map((r) => r.role as AppRole)
        setRole(roles.includes("admin") ? "admin" : "student")
      })
  }, [session?.user?.id])

  return { session, user: session?.user ?? null, role, loading }
}

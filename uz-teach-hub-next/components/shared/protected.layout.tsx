"use client"

import { useAuth } from "@/hooks/useAuth"
import type { AppRole } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PropsChild } from "@/types"

interface IProtectedLayoutProps extends PropsChild {
  /** Role required to view this subtree. */
  requireRole: AppRole
}

/**
 * ProtectedLayout — guards a route group by auth + role.
 * Replaces the ad-hoc auth checks scattered across the old route files.
 */
export default function ProtectedLayout({ children, requireRole }: IProtectedLayoutProps) {
  const router = useRouter()
  const { session, role, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!session) {
      router.replace("/auth/login")
      return
    }
    if (role && role !== requireRole) {
      router.replace(role === "admin" ? "/admin" : "/app")
    }
  }, [loading, session, role, requireRole, router])

  if (loading || !session || (role && role !== requireRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  return <>{children}</>
}

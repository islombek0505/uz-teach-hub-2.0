import { supabaseBrowser } from "@/lib/supabase/client"

export type AppRole = "admin" | "student"

/** Users log in by phone; Supabase Auth stores them as a synthetic email. */
export function phoneToEmail(phone: string) {
  const digits = phone.replace(/\D+/g, "")
  return `${digits}@platform.local`
}

export async function signInWithPhone(phone: string, password: string) {
  const supabase = supabaseBrowser()
  const email = phoneToEmail(phone)
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithPhone(phone: string, password: string, fullName: string) {
  const supabase = supabaseBrowser()
  const email = phoneToEmail(phone)
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  })
}

export async function fetchUserRole(userId: string): Promise<AppRole> {
  const supabase = supabaseBrowser()
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId)
  const roles = (data ?? []).map((r) => r.role as AppRole)
  return roles.includes("admin") ? "admin" : "student"
}

export async function signOut() {
  await supabaseBrowser().auth.signOut()
}

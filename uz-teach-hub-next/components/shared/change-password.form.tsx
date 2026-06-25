"use client"

import { useState } from "react"
import { toast } from "sonner"
import { supabaseBrowser } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

/** Change-password form — updates the Supabase auth password. */
function ChangePasswordForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) return toast.error("Parol kamida 6 ta belgidan iborat")
    if (password !== confirm) return toast.error("Parollar mos kelmadi")

    const promise = (async () => {
      const { error } = await supabaseBrowser().auth.updateUser({ password })
      if (error) throw new Error(error.message)
    })()
    toast.promise(promise, { loading: "Saqlanmoqda...", success: "Parol yangilandi.", error: "Xatolik!" })
    await promise
    setPassword("")
    setConfirm("")
  }

  return (
    <form onSubmit={submit} className="flex max-w-md flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Yangi parol</Label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Parolni tasdiqlang</Label>
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <Button type="submit" className="mt-1 self-start">
        Parolni yangilash
      </Button>
    </form>
  )
}

export default ChangePasswordForm

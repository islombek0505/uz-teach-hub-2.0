"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Lock, Phone, User2 } from "lucide-react"

import { registerSchema } from "@/lib/validation"
import { signUpWithPhone } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

function useRegisterPresenter() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", phone: "", password: "", confirm: "" },
  })

  const onSubmit = async ({ fullName, phone, password }: z.infer<typeof registerSchema>) => {
    setLoading(true)
    const promise = (async () => {
      const { error } = await signUpWithPhone(phone, password, fullName)
      if (error) throw new Error(error.message)
      router.push("/app")
    })()

    toast.promise(promise, {
      loading: "Hisob yaratilmoqda...",
      success: "Ro'yxatdan o'tdingiz!",
      error: (e) => (e as Error).message,
    })
    promise.finally(() => setLoading(false))
  }

  return { form, onSubmit, loading }
}

function RegisterPage() {
  const { form, onSubmit, loading } = useRegisterPresenter()
  const { register, handleSubmit, formState } = form
  const err = formState.errors

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Ro'yxatdan o'tish</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bir necha qadamda hisob yarating va kurslarni boshlang.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
        <div>
          <InputGroup>
            <InputGroupInput placeholder="Ism familiya" {...register("fullName")} />
            <InputGroupAddon>
              <User2 className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {err.fullName && <p className="mt-1 text-xs text-red-500">{err.fullName.message}</p>}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput placeholder="+998 90 123 45 67" type="tel" {...register("phone")} />
            <InputGroupAddon>
              <Phone className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {err.phone && <p className="mt-1 text-xs text-red-500">{err.phone.message}</p>}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput placeholder="Parol" type="password" {...register("password")} />
            <InputGroupAddon>
              <Lock className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {err.password && <p className="mt-1 text-xs text-red-500">{err.password.message}</p>}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput placeholder="Parolni tasdiqlang" type="password" {...register("confirm")} />
            <InputGroupAddon>
              <Lock className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {err.confirm && <p className="mt-1 text-xs text-red-500">{err.confirm.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="mt-1 h-12 w-full text-[15px] font-semibold">
          {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz bormi?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage

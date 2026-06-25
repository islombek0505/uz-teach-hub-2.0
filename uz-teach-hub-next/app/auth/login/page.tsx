"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeClosed, Lock, Phone } from "lucide-react"

import { loginSchema } from "@/lib/validation"
import { fetchUserRole, signInWithPhone } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

/* --------------------------- presenter hook --------------------------- */
function useLoginPresenter() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  })

  const onSubmit = async ({ phone, password }: z.infer<typeof loginSchema>) => {
    setLoading(true)
    const promise = (async () => {
      const { data, error } = await signInWithPhone(phone, password)
      if (error || !data.user) throw new Error("Telefon yoki parol noto'g'ri")
      const role = await fetchUserRole(data.user.id)
      router.push(role === "admin" ? "/admin" : "/app")
    })()

    toast.promise(promise, {
      loading: "Tekshirilmoqda...",
      success: "Tizimga kirildi!",
      error: (e) => (e as Error).message,
    })
    promise.finally(() => setLoading(false))
  }

  return { form, onSubmit, loading, showPassword, setShowPassword }
}

/* ------------------------------ component ----------------------------- */
function LoginPage() {
  const { form, onSubmit, loading, showPassword, setShowPassword } = useLoginPresenter()
  const { register, handleSubmit, formState } = form

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Xush kelibsiz!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Davom etish uchun telefon raqam va parolingiz bilan kiring.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
        <div>
          <InputGroup>
            <InputGroupInput placeholder="+998 90 123 45 67" type="tel" {...register("phone")} />
            <InputGroupAddon>
              <Phone className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {formState.errors.phone && (
            <p className="mt-1 text-xs text-red-500">{formState.errors.phone.message}</p>
          )}
        </div>

        <div>
          <InputGroup>
            <InputGroupInput
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <InputGroupAddon>
              <Lock className="size-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <button type="button" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
              </button>
            </InputGroupAddon>
          </InputGroup>
          {formState.errors.password && (
            <p className="mt-1 text-xs text-red-500">{formState.errors.password.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="mt-1 h-12 w-full text-[15px] font-semibold">
          {loading ? "Kiritilmoqda..." : "Kirish"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz yo'qmi?{" "}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
          Ro'yxatdan o'tish
        </Link>
      </p>
    </div>
  )
}

export default LoginPage

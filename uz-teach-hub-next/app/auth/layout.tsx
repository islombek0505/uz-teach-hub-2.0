import type { Metadata } from "next"
import { GraduationCap } from "lucide-react"
import { PropsChild } from "@/types"
import { SITE_NAME } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Kirish",
  description: "OnlineTalim hisobingizga kiring yoki ro'yxatdan o'ting.",
  robots: { index: false, follow: false },
}

function AuthLayout({ children }: PropsChild) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[460px] rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout

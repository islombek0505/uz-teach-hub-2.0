"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Sahifa yuklanmadi</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nimadir xato ketdi. Sahifani yangilang yoki keyinroq urinib ko'ring.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset}>Qayta urinish</Button>
          <Button variant="outline" asChild>
            <a href="/">Bosh sahifa</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

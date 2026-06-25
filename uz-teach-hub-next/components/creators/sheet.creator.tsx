import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { ReactNode } from "react"

interface ISheetCreatorProps {
  title: string
  desc?: string
  sheetOpen: boolean
  setSheetOpen: (open: boolean) => void
  children: ReactNode
}

/** SheetCreator — controlled side sheet, typically used for "update" forms. */
export function SheetCreator({ title, desc, sheetOpen, setSheetOpen, children }: ISheetCreatorProps) {
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="overflow-y-auto p-4">
        <SheetTitle className="w-[90%] text-xl">{title}</SheetTitle>
        {desc && <SheetDescription>{desc}</SheetDescription>}
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

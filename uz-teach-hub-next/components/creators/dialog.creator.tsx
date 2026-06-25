import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

interface IDialogCreatorProps {
  children?: ReactNode
  title?: string
  desc?: string
  triggerText?: string
  triggerIcon?: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
}

/**
 * DialogCreator — controlled dialog with a built-in trigger button.
 * Ported from clone-app1. Icon-only when only `triggerIcon` is given.
 */
export function DialogCreator({
  children,
  title,
  desc,
  triggerText,
  triggerIcon,
  open,
  setOpen,
}: IDialogCreatorProps) {
  const iconOnly = Boolean(triggerIcon && !triggerText)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer font-semibold"
          size={iconOnly ? "icon" : "default"}
          variant={iconOnly ? "outline" : "default"}
        >
          {triggerText}
          {triggerIcon}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

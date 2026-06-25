import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"

export interface ITableAction {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (param?: any) => void
  danger?: boolean
}

interface ITableActionsCreatorProps {
  actions: ITableAction[]
}

function ActionItem({ name, action, danger }: ITableAction) {
  return (
    <DropdownMenuItem
      className={cn("cursor-pointer", danger && "font-semibold text-red-500!")}
      onClick={action}
    >
      {name}
    </DropdownMenuItem>
  )
}

/** TableActionsCreator — row "⋯" menu built from an actions array. */
export function TableActionsCreator({ actions }: ITableActionsCreatorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md border-2">
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {actions.map((action) => (
          <ActionItem key={action.name} {...action} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

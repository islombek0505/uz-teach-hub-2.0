import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

interface IContainer extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

function Container({ children, className, ...props }: IContainer) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)} {...props}>
      {children}
    </div>
  )
}

export default Container

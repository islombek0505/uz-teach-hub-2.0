import { ReactNode } from "react"
import Section from "./section"

interface ITopbarProps {
  title: string
  desc?: string
  action?: ReactNode
}

/** Topbar — page heading + optional action slot, used at the top of pages. */
function Topbar({ title, desc, action }: ITopbarProps) {
  return (
    <Section className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </Section>
  )
}

export default Topbar

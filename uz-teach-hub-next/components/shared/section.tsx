import React, { ReactNode } from "react"

interface ISection extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode
}

function Section({ children, className, ...props }: ISection) {
  return (
    <section className={className} {...props}>
      {children}
    </section>
  )
}

export default Section

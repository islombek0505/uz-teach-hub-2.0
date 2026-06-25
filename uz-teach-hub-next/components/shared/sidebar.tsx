"use client"

import { Button } from "@/components/ui/button"
import { INavLink } from "@/constants"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/auth"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { IoExit } from "react-icons/io5"

interface ISidebarProps {
  navLinks: INavLink[]
  title?: string
}

function isActive(pathname: string, link: INavLink) {
  return link.exact ? pathname === link.link : pathname.startsWith(link.link)
}

/**
 * Sidebar — driven entirely by a `navLinks` array, so admin and student
 * sections share one component and differ only by data (see constants/).
 */
function Sidebar({ navLinks, title = "UzTeachHub" }: ISidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await signOut()
    router.push("/auth/login")
  }

  return (
    <aside className="fixed top-4 bottom-4 left-2 z-10 flex w-[280px] flex-col justify-between rounded-3xl bg-white p-4 pt-8 shadow">
      <div>
        <h2 className="mb-6 px-2 text-xl font-bold tracking-tight">{title}</h2>
        <nav>
          {navLinks.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className={cn(
                "my-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                isActive(pathname, item)
                  ? "bg-primary/5 font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="size-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <Button className="cursor-pointer" onClick={logout}>
        Chiqish
        <IoExit />
      </Button>
    </aside>
  )
}

export default Sidebar

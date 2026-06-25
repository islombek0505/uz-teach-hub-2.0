import type { Metadata } from "next"
import ProtectedLayout from "@/components/shared/protected.layout"
import Sidebar from "@/components/shared/sidebar"
import { adminNavLinks } from "@/constants"
import { PropsChild } from "@/types"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · OnlineTalim" },
  robots: { index: false, follow: false },
}

function AdminLayout({ children }: PropsChild) {
  return (
    <ProtectedLayout requireRole="admin">
      <div className="relative min-h-screen">
        <Sidebar navLinks={adminNavLinks} title="OnlineTalim Admin" />
        <main className="ml-[300px] px-8 py-10">{children}</main>
      </div>
    </ProtectedLayout>
  )
}

export default AdminLayout

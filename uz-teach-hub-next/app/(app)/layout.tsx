import type { Metadata } from "next"
import ProtectedLayout from "@/components/shared/protected.layout"
import Sidebar from "@/components/shared/sidebar"
import { studentNavLinks } from "@/constants"
import { PropsChild } from "@/types"

export const metadata: Metadata = {
  title: { default: "Mening sahifam", template: "%s · OnlineTalim" },
  robots: { index: false, follow: false },
}

function StudentLayout({ children }: PropsChild) {
  return (
    <ProtectedLayout requireRole="student">
      <div className="relative min-h-screen">
        <Sidebar navLinks={studentNavLinks} title="OnlineTalim" />
        <main className="ml-[300px] px-8 py-10">{children}</main>
      </div>
    </ProtectedLayout>
  )
}

export default StudentLayout

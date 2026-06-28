import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { ChevronLeft } from "lucide-react";
import { StudentDetailView } from "@/components/admin/student-detail-view";

export const Route = createFileRoute("/admin/student-stats/$studentId")({
  component: StudentDetailPage,
});

function StudentDetailPage() {
  const { studentId } = Route.useParams();
  return (
    <>
      <Topbar title="O'quvchi tafsilotlari" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <Link
          to="/admin/student-stats"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Statistikaga qaytish
        </Link>
        <StudentDetailView studentId={studentId} />
      </main>
    </>
  );
}

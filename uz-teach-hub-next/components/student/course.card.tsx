import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { ICourseWithCount } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/** Student-facing course card — links into the course detail page. */
function CourseCard({ course }: { course: ICourseWithCount }) {
  return (
    <Card className="overflow-hidden pt-0">
      <div
        className="aspect-video bg-muted bg-cover bg-center"
        style={course.cover_url ? { backgroundImage: `url(${course.cover_url})` } : undefined}
      />
      <CardContent className="px-5">
        {course.category && <Badge variant="secondary">{course.category}</Badge>}
        <h3 className="mt-2 line-clamp-1 text-lg font-semibold">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description ?? "—"}</p>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" /> {course.lessons?.[0]?.count ?? 0} dars
        </div>
        <Button asChild className="mt-4 w-full">
          <Link href={`/app/courses/${course.id}`}>
            Boshlash <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default CourseCard

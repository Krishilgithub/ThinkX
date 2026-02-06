import { getCourses } from "@/actions/course";
import { CourseGrid } from "@/components/dashboard/CourseGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            My Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your curriculum, chapters, and video lessons.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      <CourseGrid courses={courses} />
    </div>
  );
}

import { getCourseById } from "@/actions/course";
import { CourseHeader } from "@/components/dashboard/CourseBuilder/CourseHeader";
import { ChapterList } from "@/components/dashboard/CourseBuilder/ChapterList";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface CourseBuilderPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseBuilderPage({
  params,
}: CourseBuilderPageProps) {
  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <CourseHeader course={course} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Curriculum Area */}
        <div className="lg:col-span-2 space-y-8">
          <ChapterList courseId={course.id} initialChapters={course.chapters} />
        </div>

        {/* Sidebar: Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 sticky top-6">
            <h3 className="font-semibold font-heading mb-4 text-lg">
              Course Settings
            </h3>
            <div className="space-y-4">
              {/* Description, Thumbnail, Price placeholders */}
              <p className="text-sm text-muted-foreground">
                Metadata settings (Thumbnail, Price, Description) will go here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

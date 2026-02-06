import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { courseId } = params;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          status: "PUBLISHED",
        },
        include: {
          videos: {
            where: {
              status: "COMPLETED",
              visibility: "public",
            },
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold">{course.title}</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Student View</Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Select a video to verify playback
                </p>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{course.title}</h2>
                <p className="text-gray-500 mt-2">{course.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm sticky top-8">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Course Content</h3>
              </div>
              <div className="p-4 space-y-4">
                {course.chapters.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No chapters available
                  </div>
                ) : (
                  course.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">
                        {chapter.title}
                      </h4>
                      <div className="space-y-1">
                        {chapter.videos.length === 0 ? (
                          <div className="pl-4 text-xs text-gray-400 italic">
                            No videos
                          </div>
                        ) : (
                          chapter.videos.map((video) => (
                            <Link
                              key={video.id}
                              href={`/courses/${courseId}/lessons/${video.id}`}
                              className="block"
                            >
                              <div className="flex items-center p-2 rounded-md hover:bg-gray-50 text-sm group cursor-pointer transition-colors">
                                <PlayCircle className="h-4 w-4 mr-2 text-primary group-hover:text-primary/80" />
                                <span className="text-gray-600 group-hover:text-gray-900">
                                  {video.title}
                                </span>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

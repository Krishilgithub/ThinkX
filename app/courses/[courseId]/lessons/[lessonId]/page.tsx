import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = params;

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

  const currentVideo = await db.video.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!course || !currentVideo) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/courses/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <h1 className="text-xl font-bold">{course.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                {currentVideo.videoUrl ? (
                  <video
                    controls
                    className="w-full h-full"
                    src={currentVideo.videoUrl}
                    autoPlay
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Video unavailable
                  </div>
                )}
              </div>
              <div className="mt-6">
                <h2 className="text-2xl font-bold">{currentVideo.title}</h2>
                <p className="text-gray-500 mt-2">{currentVideo.script}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm sticky top-8">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Course Content</h3>
              </div>
              <div className="p-4 space-y-4">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      {chapter.title}
                    </h4>
                    <div className="space-y-1">
                      {chapter.videos.map((video) => {
                        const isActive = video.id === lessonId;
                        return (
                          <Link
                            key={video.id}
                            href={`/courses/${courseId}/lessons/${video.id}`}
                            className="block"
                          >
                            <div
                              className={`flex items-center p-2 rounded-md hover:bg-gray-50 text-sm group cursor-pointer transition-colors ${isActive ? "bg-sky-50 hover:bg-sky-100 text-primary" : "text-gray-600"}`}
                            >
                              <PlayCircle
                                className={`h-4 w-4 mr-2 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`}
                              />
                              <span className={isActive ? "font-medium" : ""}>
                                {video.title}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Get recent chapters with videos
  const recentVideos = await db.chapter.findMany({
    where: {
      course: {
        teacherId: user?.id,
      },
      videoUrl: {
        not: null,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here are your recent videos.
          </p>
        </div>
      </div>

      {/* Recent Videos Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-heading">Recent Videos</h2>
        </div>
        
        {recentVideos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No videos yet. Create a course and add chapters to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentVideos.map((chapter) => (
              <Link 
                key={chapter.id} 
                href={`/dashboard/courses/${chapter.course.id}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                          {chapter.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chapter.course.title}
                        </p>
                      </div>
                      <Video className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant={chapter.status === "PUBLISHED" ? "default" : "secondary"}>
                        {chapter.status}
                      </Badge>
                      {chapter.updatedAt && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(chapter.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

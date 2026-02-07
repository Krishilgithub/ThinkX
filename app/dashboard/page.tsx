export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";
import Link from "next/link";
import { RecentVideosGrid } from "@/components/dashboard/RecentVideosGrid";

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

      {/* Quick Action */}
      <section>
        <Link href="/dashboard/create">
          <Card className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2 gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">
                  Create New Course
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Start building your educational content with AI
                </p>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </section>

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
          <RecentVideosGrid videos={recentVideos} />
        )}
      </section>
    </div>
  );
}

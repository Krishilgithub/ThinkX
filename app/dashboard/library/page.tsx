import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { db } from "@/lib/db";
import { LibraryGrid } from "@/components/dashboard/LibraryGrid";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  // Get all published template/demo videos (videos without a specific teacher or marked as public)
  const templateVideos = await db.chapter.findMany({
    where: {
      videoUrl: {
        not: null,
      },
      status: "COMPLETED",
      course: {
        status: "PUBLISHED",
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          subject: true,
          topic: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Video Library
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse pre-generated video content and course materials.
        </p>
      </div>

      {templateVideos.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Videos Available Yet</CardTitle>
            <CardDescription className="max-w-sm">
              Pre-generated videos will appear here once they are published.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <LibraryGrid videos={templateVideos} />
      )}
    </div>
  );
}

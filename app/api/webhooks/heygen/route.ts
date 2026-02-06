import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_type, event_data } = body;

    console.log("HeyGen Webhook Received:", event_type, event_data);

    if (event_type === "avatar_video.status_update") {
      const { video_id, status, video_url, thumbnail_url, duration, error } =
        event_data;

      // Find video by HeyGen ID
      const video = await db.video.findFirst({
        where: { heygenId: video_id },
      });

      if (!video) {
        console.warn(`Video not found for HeyGen ID: ${video_id}`);
        return NextResponse.json(
          { message: "Video not found" },
          { status: 404 },
        );
      }

      // Update Video
      await db.video.update({
        where: { id: video.id },
        data: {
          status: status.toUpperCase(),
          videoUrl: video_url,
          thumbnail: thumbnail_url,
          duration: duration,
        },
      });

      // Update latest Job
      const latestJob = await db.videoJob.findFirst({
        where: { videoId: video.id },
        orderBy: { createdAt: "desc" },
      });

      if (latestJob) {
        await db.videoJob.update({
          where: { id: latestJob.id },
          data: {
            status: status.toUpperCase(),
            error: error,
            completedAt:
              status === "completed" || status === "failed" ? new Date() : null,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

"use server";

import { db } from "@/lib/db";
import { heyGenService, CreateVideoParams } from "@/lib/heygen";
import { revalidatePath } from "next/cache";

export async function createVideoJob(
  chapterId: string,
  params: CreateVideoParams,
) {
  try {
    // 1. Create the Video record in DRAFT/PROCESSING state
    const video = await db.video.create({
      data: {
        chapterId,
        title: params.title,
        status: "PROCESSING", // Optimistic status
        heygenId: "pending", // Will update after API call
        tone: params.tone,
        language: params.language,
        avatarId: params.avatarId,
        voiceId: params.voiceId,
      },
    });

    // 2. Call HeyGen API
    let heyGenId: string;
    try {
      heyGenId = await heyGenService.generateVideo(params);
    } catch (apiError: any) {
      // If API fails, mark video as FAILED
      await db.video.update({
        where: { id: video.id },
        data: { status: "FAILED" },
      });
      return { error: apiError.message || "Failed to start video generation" };
    }

    // 3. Update Video with real HeyGen ID
    await db.video.update({
      where: { id: video.id },
      data: { heygenId: heyGenId },
    });

    // 4. Create a Job record to track this specific generation attempt
    await db.videoJob.create({
      data: {
        videoId: video.id,
        heygenJobId: heyGenId,
        status: "PROCESSING",
      },
    });

    revalidatePath(`/dashboard/courses`);
    return { success: true, videoId: video.id, jobId: heyGenId };
  } catch (error: any) {
    console.error("createVideoJob Error:", error);
    return { error: "Internal Server Error" };
  }
}

export async function pollVideoStatus(videoId: string) {
  try {
    const video = await db.video.findUnique({
      where: { id: videoId },
      include: { jobs: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    if (!video || !video.heygenId) {
      return { status: "NOT_FOUND" };
    }

    // If already completed, just return
    if (video.status === "COMPLETED" || video.status === "FAILED") {
      return {
        status: video.status,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
      };
    }

    // Check status with HeyGen
    const statusData = await heyGenService.checkStatus(video.heygenId);

    // Update DB if status changed
    if (statusData.status !== video.status.toLowerCase()) {
      await db.video.update({
        where: { id: videoId },
        data: {
          status: statusData.status.toUpperCase(),
          videoUrl: statusData.video_url,
          thumbnail: statusData.thumbnail_url,
          duration: statusData.duration,
        },
      });

      // Also update the job record
      if (video.jobs[0]) {
        await db.videoJob.update({
          where: { id: video.jobs[0].id },
          data: {
            status: statusData.status.toUpperCase(),
            error: statusData.error,
          },
        });
      }

      revalidatePath(`/dashboard/courses`);
    }

    return {
      status: statusData.status.toUpperCase(),
      videoUrl: statusData.video_url,
      thumbnail: statusData.thumbnail_url,
      error: statusData.error,
    };
  } catch (error) {
    console.error("pollVideoStatus Error:", error);
    return { error: "Failed to check status" };
  }
}

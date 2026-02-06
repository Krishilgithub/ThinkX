"use server";

import { db } from "@/lib/db";
import { heyGenService, CreateVideoParams } from "@/lib/heygen";
import { revalidatePath } from "next/cache";

export async function createVideoJob(
  chapterId: string,
  params: CreateVideoParams,
) {
  try {
    // 1. Update Chapter to GENERATING status
    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        status: "GENERATING",
        script: params.script || null,
      },
    });

    // 2. Call HeyGen API
    let heyGenId: string;
    try {
      heyGenId = await heyGenService.generateVideo(params);
    } catch (apiError: any) {
      // If API fails, mark chapter as FAILED
      await db.chapter.update({
        where: { id: chapterId },
        data: { status: "FAILED" },
      });
      return { error: apiError.message || "Failed to start video generation" };
    }

    // 3. Update Chapter with HeyGen job ID
    await db.chapter.update({
      where: { id: chapterId },
      data: { heygenJobId: heyGenId },
    });

    // 4. Create a Job record to track this specific generation attempt
    await db.videoJob.create({
      data: {
        chapterId: chapterId,
        heygenJobId: heyGenId,
        status: "PROCESSING",
        avatarId: params.avatarId,
        voiceId: params.voiceId,
        script: params.script,
      },
    });

    revalidatePath(`/dashboard/courses`);
    return { success: true, chapterId: chapterId, jobId: heyGenId };
  } catch (error: any) {
    console.error("createVideoJob Error:", error);
    return { error: "Internal Server Error" };
  }
}

export async function pollVideoStatus(chapterId: string) {
  try {
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId },
      include: { jobs: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    if (!chapter || !chapter.heygenJobId) {
      return { status: "NOT_FOUND" };
    }

    // If already completed, just return
    if (chapter.status === "COMPLETED" || chapter.status === "FAILED") {
      return {
        status: chapter.status,
        videoUrl: chapter.videoUrl,
        thumbnail: chapter.thumbnail,
      };
    }

    // Check status with HeyGen
    const statusData = await heyGenService.checkStatus(chapter.heygenJobId);

    // Update DB if status changed
    if (statusData.status !== chapter.status.toLowerCase()) {
      await db.chapter.update({
        where: { id: chapterId },
        data: {
          status: statusData.status.toUpperCase(),
          videoUrl: statusData.video_url,
          thumbnail: statusData.thumbnail_url,
          duration: statusData.duration,
        },
      });

      // Also update the job record
      if (chapter.jobs[0]) {
        await db.videoJob.update({
          where: { id: chapter.jobs[0].id },
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

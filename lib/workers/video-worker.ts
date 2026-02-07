/**
 * Video Generation Worker
 *
 * Background worker that processes video generation jobs using BullMQ
 */

import { Job, Worker } from "bullmq";
import { db } from "@/lib/db";
import { heyGenService } from "@/lib/heygen";
import { cloudinaryService } from "@/lib/cloudinary";
import IORedis from "ioredis";
import type { VideoJobData } from "@/lib/queue";

// Redis connection
const connection = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
);

/**
 * Poll HeyGen API until video generation completes
 * This is a fallback mechanism if webhooks fail
 */
async function pollUntilComplete(jobId: string, heyGenJobId: string) {
  const MAX_POLLS = 120; // 10 minutes (5s intervals)
  let pollCount = 0;

  while (pollCount < MAX_POLLS) {
    // Wait 5 seconds between polls
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const status = await heyGenService.checkStatus(heyGenJobId);

      console.log(
        `[Worker] Poll ${pollCount + 1}/${MAX_POLLS} for job ${jobId}: ${status.status}`,
      );

      // Log polling event
      await db.jobEvent.create({
        data: {
          jobId,
          eventType: "POLLING",
          message: `Poll attempt ${pollCount + 1}: status=${status.status}`,
        },
      });

      if (status.status === "completed") {
        // Upload to Cloudinary
        let finalVideoUrl = status.video_url;
        let finalThumbnailUrl = status.thumbnail_url;

        if (status.video_url) {
          try {
            console.log("[Worker] Uploading completed video to Cloudinary...");
            const cloudinaryResult = await cloudinaryService.uploadVideoFromUrl(
              status.video_url,
              { folder: "thinkx-videos" },
            );

            if (cloudinaryResult.secureUrl) {
              finalVideoUrl = cloudinaryResult.secureUrl;
              finalThumbnailUrl =
                cloudinaryResult.thumbnailUrl || status.thumbnail_url;
              console.log("[Worker] Video uploaded to Cloudinary");
            }
          } catch (uploadError: any) {
            console.error(
              "[Worker] Cloudinary upload failed:",
              uploadError.message,
            );
          }
        }

        // Update job to COMPLETED
        const updatedJob = await db.videoJob.update({
          where: { id: jobId },
          data: {
            status: "COMPLETED",
            progress: 100,
            videoUrl: finalVideoUrl,
            thumbnailUrl: finalThumbnailUrl,
            duration: status.duration,
            completedAt: new Date(),
          },
        });

        // Update chapter
        await db.chapter.update({
          where: { id: updatedJob.chapterId },
          data: {
            status: "COMPLETED",
            videoUrl: finalVideoUrl,
            thumbnail: finalThumbnailUrl,
            duration: status.duration,
          },
        });

        // Log completion
        await db.jobEvent.create({
          data: {
            jobId,
            eventType: "COMPLETED",
            message: "Video generation completed via polling",
            metadata: { videoUrl: finalVideoUrl },
          },
        });

        return;
      }

      if (status.status === "failed") {
        throw new Error(status.error || "HeyGen generation failed");
      }

      // Update progress
      await db.videoJob.update({
        where: { id: jobId },
        data: { progress: Math.min(95, (pollCount + 1) * 2) },
      });

      pollCount++;
    } catch (error: any) {
      if (error.message.includes("failed")) {
        throw error; // Let BullMQ handle retry
      }
      console.error(`[Worker] Poll error:`, error);
      // Continue polling on transient errors
    }
  }

  throw new Error("Polling timeout: Video generation took too long");
}

/**
 * BullMQ Worker for video generation
 */
const worker = new Worker<VideoJobData>(
  "video-generation",
  async (job: Job<VideoJobData>) => {
    const { jobId, chapterId, params } = job.data;

    console.log(`[Worker] Starting job ${jobId}`);

    try {
      // 1. Update job to PROCESSING
      await db.videoJob.update({
        where: { id: jobId },
        data: {
          status: "PROCESSING",
          startedAt: new Date(),
        },
      });

      await db.jobEvent.create({
        data: {
          jobId,
          eventType: "PROCESSING",
          message: "Worker started processing job",
          metadata: { workerId: worker.id, attempt: job.attemptsMade + 1 },
        },
      });

      // 2. Call HeyGen API
      console.log(`[Worker] Calling HeyGen API for job ${jobId}`);
      const heyGenJobId = await heyGenService.generateVideo(params);

      // 3. Store HeyGen job ID
      await db.videoJob.update({
        where: { id: jobId },
        data: { heygenJobId: heyGenJobId },
      });

      console.log(`[Worker] HeyGen job created: ${heyGenJobId}`);

      // 4. Start polling (fallback if webhook fails)
      await pollUntilComplete(jobId, heyGenJobId);

      return { success: true, heyGenJobId };
    } catch (error: any) {
      console.error(`[Worker] Job ${jobId} failed:`, error);

      // Update job to FAILED
      await db.videoJob.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          error: error.message,
          errorCode: error.code || "WORKER_ERROR",
          retryCount: job.attemptsMade + 1,
        },
      });

      // Update chapter
      await db.chapter.update({
        where: { id: chapterId },
        data: { status: "FAILED" },
      });

      await db.jobEvent.create({
        data: {
          jobId,
          eventType: "FAILED",
          message: `Job failed: ${error.message}`,
          metadata: {
            error: error.toString(),
            attempt: job.attemptsMade + 1,
          },
        },
      });

      // Rethrow to trigger BullMQ retry
      throw error;
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 jobs concurrently
    limiter: {
      max: 10, // Max 10 jobs per minute
      duration: 60000,
    },
  },
);

// Worker event handlers
worker.on("completed", (job) => {
  console.log(`[Worker] ✅ Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] ❌ Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error("[Worker] Worker error:", err);
});

console.log("[Worker] Video generation worker started");

export default worker;

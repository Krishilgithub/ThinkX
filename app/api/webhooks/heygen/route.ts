/**
 * HeyGen Webhook Handler (Production-Grade)
 *
 * POST /api/webhooks/heygen
 *
 * Receives status updates from HeyGen API via webhooks
 */

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { cloudinaryService } from "@/lib/cloudinary";

/**
 * Verify webhook signature using HMAC SHA256
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.HEYGEN_WEBHOOK_SECRET;

  if (!secret) {
    console.warn("[Webhook] HEYGEN_WEBHOOK_SECRET not configured");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // 1. Get signature and payload
    const headersList = await headers();
    const signature = headersList.get("x-heygen-signature") || "";
    const payload = await req.text();

    // 2. Verify signature in production
    if (
      process.env.NODE_ENV === "production" &&
      !verifyWebhookSignature(payload, signature)
    ) {
      console.warn("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse webhook data
    const body = JSON.parse(payload);
    const { event_type, event_data } = body;

    console.log("HeyGen Webhook Received:", event_type, event_data);

    if (event_type === "avatar_video.status_update") {
      const { video_id, status, video_url, thumbnail_url, duration, error } =
        event_data;

      // Find chapter and job by HeyGen ID
      const chapter = await db.chapter.findFirst({
        where: { heygenJobId: video_id },
      });

      if (!chapter) {
        console.warn(`Chapter not found for HeyGen ID: ${video_id}`);
        return NextResponse.json(
          { message: "Chapter not found" },
          { status: 404 },
        );
      }

      // Upload to Cloudinary if completed
      let finalVideoUrl = video_url;
      let finalThumbnailUrl = thumbnail_url;

      if (status === "completed" && video_url) {
        try {
          console.log("[Webhook] Uploading video to Cloudinary...");
          const cloudinaryResult = await cloudinaryService.uploadVideoFromUrl(
            video_url,
            { chapterId: chapter.id, folder: "thinkx-videos" },
          );

          if (cloudinaryResult.secureUrl) {
            finalVideoUrl = cloudinaryResult.secureUrl;
            finalThumbnailUrl = cloudinaryResult.thumbnailUrl || thumbnail_url;
          }
        } catch (uploadError: any) {
          console.error(
            "[Webhook] Cloudinary upload failed:",
            uploadError.message,
          );
        }
      }

      // Update Chapter
      await db.chapter.update({
        where: { id: chapter.id },
        data: {
          status: status.toUpperCase(),
          videoUrl: finalVideoUrl,
          thumbnail: finalThumbnailUrl,
          duration: duration,
        },
      });

      // Update latest Job
      const latestJob = await db.videoJob.findFirst({
        where: { chapterId: chapter.id },
        orderBy: { createdAt: "desc" },
      });

      if (latestJob) {
        await db.videoJob.update({
          where: { id: latestJob.id },
          data: {
            status: status.toUpperCase(),
            error: error || null,
            errorCode: status === "failed" ? "HEYGEN_ERROR" : null,
            videoUrl: finalVideoUrl,
            thumbnailUrl: finalThumbnailUrl,
            duration,
            webhookReceivedAt: new Date(),
            webhookPayload: event_data,
            completedAt:
              status === "completed" || status === "failed" ? new Date() : null,
            progress: status === "completed" ? 100 : latestJob.progress,
          },
        });

        // Log webhook event
        await db.jobEvent.create({
          data: {
            jobId: latestJob.id,
            eventType: "WEBHOOK_RECEIVED",
            message: `Webhook received: status=${status}`,
            metadata: event_data,
          },
        });
      }

      return NextResponse.json(
        { message: "Webhook processed" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { message: "Event type not supported" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

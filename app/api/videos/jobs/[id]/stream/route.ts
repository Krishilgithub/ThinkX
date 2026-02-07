/**
 * Server-Sent Events Stream for Job Status
 *
 * GET /api/videos/jobs/[id]/stream
 *
 * Provides real-time status updates via Server-Sent Events
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: jobId } = await params;
  const encoder = new TextEncoder();

  // Create readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const sendUpdate = async () => {
        if (isClosed) return;

        try {
          // Fetch current job status
          const job = await db.videoJob.findUnique({
            where: { id: jobId },
            select: {
              status: true,
              progress: true,
              videoUrl: true,
              thumbnailUrl: true,
              error: true,
              errorCode: true,
            },
          });

          if (!job) {
            // Job not found, close stream
            controller.close();
            isClosed = true;
            return;
          }

          // Prepare data
          const data = JSON.stringify({
            status: job.status,
            progress: job.progress,
            videoUrl: job.videoUrl,
            thumbnailUrl: job.thumbnailUrl,
            error: job.error,
            errorCode: job.errorCode,
            timestamp: new Date().toISOString(),
          });

          // Send SSE message
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));

          // Close stream if job is in terminal state
          if (
            job.status === "COMPLETED" ||
            job.status === "FAILED" ||
            job.status === "CANCELLED"
          ) {
            setTimeout(() => {
              if (!isClosed) {
                controller.close();
                isClosed = true;
              }
            }, 1000); // Wait 1s before closing
          }
        } catch (error) {
          console.error("[SSE] Error:", error);
          if (!isClosed) {
            controller.close();
            isClosed = true;
          }
        }
      };

      // Send initial update immediately
      await sendUpdate();

      // Poll every 2 seconds
      const interval = setInterval(sendUpdate, 2000);

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        if (!isClosed) {
          controller.close();
          isClosed = true;
        }
      });
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}

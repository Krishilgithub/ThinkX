/**
 * Video Job Status API
 *
 * GET /api/videos/jobs/[id]
 *
 * Returns the current status of a video generation job
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const jobId = params.id;

    // Fetch job with related chapter info
    const job = await db.videoJob.findUnique({
      where: { id: jobId },
      include: {
        chapter: {
          include: {
            course: {
              select: { teacherId: true, title: true },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Note: Add authentication check here
    // Verify that the requesting user owns this job

    // Return job status
    return NextResponse.json({
      id: job.id,
      chapterId: job.chapterId,
      status: job.status,
      progress: job.progress,

      // Video output
      videoUrl: job.videoUrl,
      thumbnailUrl: job.thumbnailUrl,
      duration: job.duration,
      fileSize: job.fileSize,

      // Error info
      error: job.error,
      errorCode: job.errorCode,

      // Retry info
      retryCount: job.retryCount,
      maxRetries: job.maxRetries,

      // Timestamps
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,

      // Metadata
      chapter: {
        id: job.chapter.id,
        title: job.chapter.title,
        courseTitle: job.chapter.course.title,
      },
    });
  } catch (error) {
    console.error("[Job Status API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

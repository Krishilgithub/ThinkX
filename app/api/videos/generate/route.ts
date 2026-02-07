/**
 * Video Generation API - Create Job
 *
 * POST /api/videos/generate
 *
 * Creates a new video generation job and enqueues it for async processing
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videoQueue } from "@/lib/queue";
import { z } from "zod";

// Validation schema
const generateSchema = z.object({
  chapterId: z.string().uuid("Invalid chapter ID"),
  title: z.string().min(1, "Title required").max(200, "Title too long"),
  script: z.string().min(10, "Script must be at least 10 characters"),
  avatarId: z.string().min(1, "Avatar ID required"),
  voiceId: z.string().optional(),
  background: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid HEX color")
    .optional(),
  language: z.string().default("en"),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await req.json();
    const params = generateSchema.parse(body);

    // 2. Verify chapter exists and get ownership info
    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId },
      include: { course: { select: { teacherId: true } } },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Note: Authentication would typically happen here via session/JWT
    // For now, we'll proceed without auth (you can add this later)

    // 3. Create job record
    const job = await db.videoJob.create({
      data: {
        chapterId: params.chapterId,
        status: "PENDING",
        avatarId: params.avatarId,
        voiceId: params.voiceId || null,
        script: params.script,
        background: params.background || "#FFFFFF",
        language: params.language,
      },
    });

    // 4. Log creation event
    await db.jobEvent.create({
      data: {
        jobId: job.id,
        eventType: "CREATED",
        message: `Job created for chapter ${params.chapterId}`,
        metadata: {
          title: params.title,
          chapterId: params.chapterId,
        },
      },
    });

    // 5. Enqueue for processing
    await videoQueue.add(
      "generate-video",
      {
        jobId: job.id,
        chapterId: params.chapterId,
        params: {
          title: params.title,
          script: params.script,
          avatarId: params.avatarId,
          voiceId: params.voiceId,
          background: params.background,
          language: params.language,
        },
      },
      {
        jobId: job.id, // Use DB job ID as queue job ID
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    );

    // 6. Log queued event
    await db.jobEvent.create({
      data: {
        jobId: job.id,
        eventType: "QUEUED",
        message: "Job added to processing queue",
      },
    });

    // 7. Update chapter status
    await db.chapter.update({
      where: { id: params.chapterId },
      data: { status: "GENERATING" },
    });

    // 8. Return response
    return NextResponse.json(
      {
        success: true,
        jobId: job.id,
        status: job.status,
        message: "Video generation job created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    // Validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    // Generic error
    console.error("[Video Generation API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

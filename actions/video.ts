"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getDemoUser } from "./user";

export async function getVideos(chapterId: string) {
  try {
    return await db.video.findMany({
      where: { chapterId },
      orderBy: { createdAt: "asc" },
      include: {
        analytics: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export async function createVideo(data: {
  chapterId: string;
  title: string;
  script?: string;
  videoUrl?: string;
}) {
  const user = await getDemoUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const newVideo = await db.video.create({
      data: {
        title: data.title,
        script: data.script,
        videoUrl: data.videoUrl,
        chapterId: data.chapterId,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/courses");
    return newVideo;
  } catch (error) {
    console.error("Failed to create video:", error);
    throw new Error("Failed to create video");
  }
}

// Legacy support / Refactor helper: "Recent Videos" globally?
export async function getGlobalRecentVideos(limit: number = 5) {
  // This might be tricky without a direct User relation, but we can query via Chapter->Course->User
  // For now, let's just return empty or implement a more complex query if strictly needed.
  // Given the schema, Video -> Chapter -> Course -> User.
  const user = await getDemoUser();
  if (!user) return [];

  try {
    return await db.video.findMany({
      where: {
        chapter: {
          course: {
            userId: user.id,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        chapter: {
          include: {
            course: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch recent videos:", error);
    return [];
  }
}

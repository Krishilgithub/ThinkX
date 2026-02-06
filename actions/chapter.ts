"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getDemoUser } from "./user";

export async function getChapters(courseId: string) {
  try {
    return await db.chapter.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
      include: {
        videos: {
          orderBy: { createdAt: "asc" }, // or orderIndex if added
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return [];
  }
}

export async function createChapter(courseId: string, title: string) {
  const user = await getDemoUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { orderIndex: "desc" },
    });

    const newOrderIndex = lastChapter ? lastChapter.orderIndex + 1 : 0;

    const newChapter = await db.chapter.create({
      data: {
        title,
        courseId,
        orderIndex: newOrderIndex,
        status: "DRAFT",
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return newChapter;
  } catch (error) {
    console.error("Failed to create chapter:", error);
    throw new Error("Failed to create chapter");
  }
}

export async function reorderChapters(
  courseId: string,
  updates: { id: string; orderIndex: number }[],
) {
  const user = await getDemoUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const transaction = updates.map((update) =>
      db.chapter.update({
        where: { id: update.id },
        data: { orderIndex: update.orderIndex },
      }),
    );

    await db.$transaction(transaction);
    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder chapters:", error);
    throw new Error("Failed to reorder chapters");
  }
}

export async function deleteChapter(chapterId: string) {
  const user = await getDemoUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await db.chapter.delete({
      where: { id: chapterId },
    });

    // Note: We might want to revalidate the course page parent, but we don't have courseId easily available unless we fetch it first.
    // Assuming this is called from a context where revalidation handles it or we return success and client handles UI.
    return { success: true };
  } catch (error) {
    console.error("Failed to delete chapter:", error);
    throw new Error("Failed to delete chapter");
  }
}

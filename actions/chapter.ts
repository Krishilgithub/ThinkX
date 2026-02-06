"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getDemoUser } from "./user";

export async function getChapters(courseId: string) {
  try {
    return await db.chapter.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return [];
  }
}

export async function createChapter(data: {
  courseId: string;
  title: string;
  description?: string;
}) {
  const teacher = await getDemoUser();
  if (!teacher) throw new Error("Unauthorized");

  try {
    const lastChapter = await db.chapter.findFirst({
      where: { courseId: data.courseId },
      orderBy: { orderIndex: "desc" },
    });

    const newOrderIndex = lastChapter ? lastChapter.orderIndex + 1 : 0;

    const newChapter = await db.chapter.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        orderIndex: newOrderIndex,
        status: "DRAFT",
      },
    });

    revalidatePath(`/dashboard/courses/${data.courseId}`);
    return newChapter;
  } catch (error) {
    console.error("Failed to create chapter:", error);
    throw new Error("Failed to create chapter");
  }
}

export async function updateChapter(chapterId: string, data: {
  title?: string;
  description?: string;
  videoUrl?: string;
  status?: string;
}) {
  const teacher = await getDemoUser();
  if (!teacher) throw new Error("Unauthorized");

  try {
    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data,
    });

    revalidatePath(`/dashboard/courses`);
    return updatedChapter;
  } catch (error) {
    console.error("Failed to update chapter:", error);
    throw new Error("Failed to update chapter");
  }
}

export async function reorderChapters(
  courseId: string,
  updates: { id: string; orderIndex: number }[],
) {
  const teacher = await getDemoUser();
  if (!teacher) throw new Error("Unauthorized");

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

export async function deleteChapter(chapterId: string, courseId: string) {
  const teacher = await getDemoUser();
  if (!teacher) throw new Error("Unauthorized");

  try {
    await db.chapter.delete({
      where: { id: chapterId },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete chapter:", error);
    throw new Error("Failed to delete chapter");
  }
}

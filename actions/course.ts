"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getDemoUser } from "./user";

export async function getCourses() {
  const user = await getDemoUser();
  if (!user) return [];

  try {
    const courses = await db.course.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            chapters: true,
            enrollments: true,
          },
        },
        analytics: true,
      },
    });

    return courses;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export async function getRecentCourses(limit: number = 5) {
  const user = await getDemoUser();
  if (!user) return [];

  try {
    return await db.course.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        analytics: true,
        _count: {
          select: { chapters: true, enrollments: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch recent courses:", error);
    return [];
  }
}

export async function createCourse(data: {
  title: string;
  description?: string;
}) {
  const user = await getDemoUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const newCourse = await db.course.create({
      data: {
        title: data.title,
        description: data.description,
        userId: user.id,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/courses");
    return newCourse;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw new Error("Failed to create course");
  }
}

export async function getCourseById(id: string) {
  const user = await getDemoUser();
  if (!user) return null;

  try {
    return await db.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { orderIndex: "asc" },
          include: {
            videos: {
              orderBy: { createdAt: "asc" }, // Need to add orderIndex to Video later if needed
            },
          },
        },
        analytics: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

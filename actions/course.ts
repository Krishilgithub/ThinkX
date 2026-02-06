"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getDemoUser } from "./user";

export async function getCourses() {
  const teacher = await getDemoUser();
  if (!teacher) return [];

  try {
    const courses = await db.course.findMany({
      where: { teacherId: teacher.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });

    return courses;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export async function getRecentCourses(limit: number = 5) {
  const teacher = await getDemoUser();
  if (!teacher) return [];

  try {
    return await db.course.findMany({
      where: { teacherId: teacher.id },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        _count: {
          select: { chapters: true },
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
  subject: string;
  topic: string;
  description?: string;
  duration: number;
  avatarId: string;
  voiceId: string;
  targetAudience: string;
  ageGroup: string;
  style: string;
  tone: string;
  keywords: string[];
}) {
  const teacher = await getDemoUser();
  if (!teacher) throw new Error("Unauthorized");

  try {
    const newCourse = await db.course.create({
      data: {
        ...data,
        teacherId: teacher.id,
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
  const teacher = await getDemoUser();
  if (!teacher) return null;

  try {
    return await db.course.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

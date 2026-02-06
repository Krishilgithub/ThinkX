"use server";

import { db } from "@/lib/db";
import { getDemoUser } from "./user";

export async function getLessons() {
  const user = await getDemoUser();
  if (!user) return [];

  return await db.lesson.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      analytics: true,
    },
  });
}

export async function getLessonById(id: string) {
  return await db.lesson.findUnique({
    where: { id },
    include: {
      analytics: true,
    },
  });
}

export async function createLesson(data: {
  title: string;
  description: string;
}) {
  const user = await getDemoUser();
  if (!user) throw new Error("User not found");

  return await db.lesson.create({
    data: {
      ...data,
      userId: user.id,
      status: "Draft",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop", // placeholder
    },
  });
}

export async function getRecentLessons(limit = 3) {
  const user = await getDemoUser();
  if (!user) return [];

  return await db.lesson.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      analytics: true,
    },
  });
}

export async function getLessonStats() {
  const user = await getDemoUser();
  if (!user) return { totalViews: 0, totalLessons: 0, avgEngagement: 0 };

  const lessons = await db.lesson.findMany({
    where: { userId: user.id },
    include: { analytics: true },
  });

  const totalViews = lessons.reduce((acc, l) => acc + l.views, 0);
  const totalLessons = lessons.length;

  // Calculate average engagement from available analytics
  const engagementSum = lessons.reduce(
    (acc, l) => acc + (l.analytics?.engagementScore || 0),
    0,
  );
  const lessonsWithAnalytics = lessons.filter((l) => l.analytics).length;
  const avgEngagement =
    lessonsWithAnalytics > 0
      ? Math.round(engagementSum / lessonsWithAnalytics)
      : 0;

  return {
    totalViews,
    totalLessons,
    avgEngagement,
  };
}

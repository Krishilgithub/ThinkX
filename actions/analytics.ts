"use server";

import { db } from "@/lib/db";
import { getDemoUser } from "./user";

export async function getAnalyticsOverview() {
  const user = await getDemoUser();
  if (!user) return null;

  try {
    const courses = await db.course.findMany({
      where: { userId: user.id },
      include: { analytics: true },
    });

    // Calculate high-level stats
    const totalViews = courses.reduce(
      (acc: number, c: any) => acc + (c.analytics?.totalViews || 0),
      0,
    );

    // totalWatchTime is not in schema yet, mocking based on views * avg duration (e.g. 5 mins -> 300s)
    const totalWatchTime = totalViews * 300;

    // Avg Engagement
    const engagementSum = courses.reduce(
      (acc: number, c: any) => acc + (c.analytics?.completionRate || 0),
      0,
    );

    const measuredCourses = courses.filter(
      (c: any) => c.analytics !== null,
    ).length;
    const avgEngagement =
      measuredCourses > 0 ? Math.round(engagementSum / measuredCourses) : 0;

    // Mocking time-series data for the chart because we don't store daily views yet
    const viewsOverTime = [
      { month: "Jan", views: Math.floor(totalViews * 0.1) },
      { month: "Feb", views: Math.floor(totalViews * 0.15) },
      { month: "Mar", views: Math.floor(totalViews * 0.12) },
      { month: "Apr", views: Math.floor(totalViews * 0.2) },
      { month: "May", views: Math.floor(totalViews * 0.25) },
      { month: "Jun", views: Math.floor(totalViews * 0.18) },
    ];

    const retentionData = [
      { name: "0%", value: 100 },
      { name: "25%", value: 85 },
      { name: "50%", value: 70 },
      { name: "75%", value: 50 },
      { name: "100%", value: 30 },
    ];

    const quizData = [
      { name: "A (90-100)", value: 400, color: "#10B981" },
      { name: "B (80-89)", value: 300, color: "#3B82F6" },
      { name: "C (70-79)", value: 200, color: "#F59E0B" },
      { name: "D (60-69)", value: 100, color: "#F97316" },
      { name: "F (<60)", value: 50, color: "#EF4444" },
    ];

    const engagementWeek = [
      { day: "Mon", hours: 45 },
      { day: "Tue", hours: 52 },
      { day: "Wed", hours: 38 },
      { day: "Thu", hours: 65 },
      { day: "Fri", hours: 48 },
      { day: "Sat", hours: 20 },
      { day: "Sun", hours: 15 },
    ];

    return {
      totalViews,
      totalWatchTime, // in seconds
      avgEngagement,
      completionRate: avgEngagement, // Reuse engagement as completion rate proxy
      viewsOverTime,
      retentionData,
      quizData,
      engagementWeek,
    };
  } catch (error) {
    console.error("Analytics Error:", error);
    return null;
  }
}

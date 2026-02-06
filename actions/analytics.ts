"use server";

import { db } from "@/lib/db";
import { getDemoUser } from "./user";

export async function getAnalyticsOverview() {
  const teacher = await getDemoUser();
  if (!teacher) return null;

  try {
    const courses = await db.course.findMany({
      where: { teacherId: teacher.id },
      include: {
        chapters: {
          where: { status: "COMPLETED" },
        },
      },
    });

    // Calculate high-level stats
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === "PUBLISHED").length;
    const totalChapters = courses.reduce((acc, c) => acc + c.chapters.length, 0);
    
    // Mock analytics data (in production, you'd track actual views)
    const totalViews = publishedCourses * 150; // Mock: avg 150 views per published course
    const totalWatchTime = totalViews * 300; // Mock: avg 5 min watch time
    const avgEngagement = publishedCourses > 0 ? Math.round((totalChapters / publishedCourses) * 15) : 0; // Mock engagement

    // Mock time-series data for the chart
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

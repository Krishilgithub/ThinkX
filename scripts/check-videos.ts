/**
 * Quick script to check video generation status
 */

import { db } from "../lib/db";

async function checkVideos() {
  console.log("🔍 Checking video generation status...\n");

  // Get all chapters with video jobs
  const chapters = await db.chapter.findMany({
    where: {
      heygenJobId: { not: null },
    },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      course: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (chapters.length === 0) {
    console.log("❌ No video generation jobs found in database");
    return;
  }

  console.log(`Found ${chapters.length} chapters with video jobs:\n`);

  for (const chapter of chapters) {
    const job = chapter.jobs[0];
    const statusEmoji =
      {
        COMPLETED: "✅",
        PROCESSING: "⏳",
        GENERATING: "🔄",
        FAILED: "❌",
        DRAFT: "📝",
      }[chapter.status] || "❓";

    console.log(`${statusEmoji} ${chapter.title || "Untitled"}`);
    console.log(`   Course: ${chapter.course.title}`);
    console.log(`   Status: ${chapter.status}`);
    console.log(`   HeyGen Job ID: ${chapter.heygenJobId}`);

    if (chapter.videoUrl) {
      console.log(`   ✅ Video URL: ${chapter.videoUrl}`);
    }

    if (job) {
      console.log(
        `   Last Job: ${job.status} (${job.createdAt.toLocaleString()})`,
      );
    }

    console.log("");
  }

  // Summary
  const statusCounts = chapters.reduce(
    (acc, ch) => {
      acc[ch.status] = (acc[ch.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("\n📊 Summary:");
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });

  const completedWithVideo = chapters.filter(
    (ch) => ch.status === "COMPLETED" && ch.videoUrl,
  );
  console.log(`\n✅ Videos ready to watch: ${completedWithVideo.length}`);
}

checkVideos()
  .catch(console.error)
  .finally(() => process.exit(0));

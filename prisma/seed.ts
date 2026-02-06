import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create Demo Teacher
  const teacher = await prisma.teacher.upsert({
    where: { email: "demo@thinkx.ai" },
    update: {},
    create: {
      email: "demo@thinkx.ai",
      name: "Krishil Agrawal",
      bio: "AI Education Pioneer creating engaging video content for students worldwide.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
  });

  console.log({ teacher });

  // 2. Create Courses with Video Generation Parameters
  const coursesData = [
    {
      title: "Introduction to AI & Physics",
      subject: "Physics",
      topic: "Fundamentals of AI in Physical Systems",
      description: "Learn how artificial intelligence is revolutionizing physics research and applications.",
      duration: 600, // 10 minutes in seconds
      avatarId: "avatar_001",
      voiceId: "voice_en_us_female_01",
      targetAudience: "Students",
      ageGroup: "16-20",
      style: "Educational",
      tone: "Friendly",
      keywords: ["AI", "Physics", "Machine Learning", "Applications"],
      status: "PUBLISHED",
      teacherId: teacher.id,
      chapters: {
        create: [
          {
            title: "Introduction to AI in Physics",
            description: "Understanding the basics of AI and its applications in physics",
            orderIndex: 0,
            status: "COMPLETED",
            videoUrl: "https://example.com/videos/ai-physics-intro.mp4",
            duration: 600,
            script: "Welcome to our course on AI and Physics. In this module, we'll explore how artificial intelligence is transforming the field of physics...",
          },
          {
            title: "AI Algorithms in Research",
            description: "Learn about specific AI algorithms used in physics research",
            orderIndex: 1,
            status: "DRAFT",
          },
        ],
      },
    },
    {
      title: "Advanced Calculus: Mastering Limits",
      subject: "Mathematics",
      topic: "Limits and Continuity",
      description: "Deep dive into calculus limits, continuity, and their real-world applications.",
      duration: 720, // 12 minutes
      avatarId: "avatar_002",
      voiceId: "voice_en_us_male_01",
      targetAudience: "University Students",
      ageGroup: "18-25",
      style: "Professional",
      tone: "Formal",
      keywords: ["Calculus", "Limits", "Continuity", "Mathematics"],
      status: "DRAFT",
      teacherId: teacher.id,
    },
    {
      title: "Chemistry Lab Safety Essentials",
      subject: "Chemistry",
      topic: "Laboratory Safety Protocols",
      description: "Essential safety guidelines and best practices for chemistry laboratories.",
      duration: 480, // 8 minutes
      avatarId: "avatar_003",
      voiceId: "voice_en_us_female_02",
      targetAudience: "High School Students",
      ageGroup: "14-18",
      style: "Educational",
      tone: "Serious",
      keywords: ["Chemistry", "Lab Safety", "Protocols", "Science"],
      status: "PUBLISHED",
      teacherId: teacher.id,
    },
  ];

  for (const c of coursesData) {
    await prisma.course.create({
      data: c,
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

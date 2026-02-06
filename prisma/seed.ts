import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create Main User
  const user = await prisma.user.upsert({
    where: { email: "demo@thinkx.ai" },
    update: {},
    create: {
      email: "demo@thinkx.ai",
      name: "Krishil Agrawal",
      bio: "AI Education Pioneer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      settings: {
        create: {
          emailNotify: true,
          studentNotify: true,
          marketingNotify: false,
        },
      },
    },
  });

  console.log({ user });

  // 2. Create Courses
  const coursesData = [
    {
      title: "Introduction to AI Physics",
      description: "Learn the fundamentals of AI applied to physical systems.",
      status: "PUBLISHED",
      chapters: {
        create: [
          {
            title: "Module 1: Basics",
            videos: {
              create: [
                {
                  title: "Welcome to the Course",
                  status: "PUBLISHED",
                  duration: 624, // 10:24
                },
              ],
            },
          },
        ],
      },
      userId: user.id,
    },
    {
      title: "Advanced Calculus: Limits",
      description: "Master limits and continuity.",
      status: "DRAFT",
      userId: user.id,
    },
    {
      title: "Chemistry Lab Safety",
      description: "Essential safety protocols.",
      status: "PUBLISHED",
      userId: user.id,
    },
  ];

  for (const c of coursesData) {
    await prisma.course.create({
      data: c,
    });
  }

  // 3. Create Resources
  const resourcesData = [
    {
      name: "Physics_Syllabus_2024.pdf",
      type: "PDF",
      url: "#",
      size: "2.4 MB",
      userId: user.id,
    },
  ];

  for (const r of resourcesData) {
    await prisma.resource.create({
      data: r,
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

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

  // 2. Create Lessons
  const lessonsData = [
    {
      title: "Introduction to AI Physics",
      status: "Published",
      views: 1205,
      duration: "10:24",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      userId: user.id,
    },
    {
      title: "Advanced Calculus: Limits",
      status: "Processing",
      views: 0,
      duration: "15:30",
      thumbnail:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
      userId: user.id,
    },
    {
      title: "History of the Renaissance",
      status: "Draft",
      views: 0,
      duration: "00:00",
      thumbnail:
        "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=2074&auto=format&fit=crop",
      userId: user.id,
    },
    {
      title: "Chemistry Lab Safety 101",
      status: "Published",
      views: 890,
      duration: "08:15",
      thumbnail:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
      userId: user.id,
    },
  ];

  for (const l of lessonsData) {
    await prisma.lesson.create({
      data: l,
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
    {
      name: "Lab_Safety_Guidelines.docx",
      type: "Doc",
      url: "#",
      size: "1.1 MB",
      userId: user.id,
    },
    {
      name: " Renaissance_Art.jpg",
      type: "Image",
      url: "#",
      size: "3.5 MB",
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

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding demo videos...");

    // Create a demo teacher account for template videos
    const demoTeacher = await prisma.teacher.upsert({
        where: { email: "demo@thinkx.com" },
        update: {},
        create: {
            email: "demo@thinkx.com",
            name: "ThinkX Demo",
            password: await bcrypt.hash("demo-password-not-used", 10),
            bio: "Official ThinkX demo content creator",
        },
    });

    console.log("✅ Demo teacher created");

    // Create demo courses with videos
    const demoCourses = [
        {
            title: "Data Structures: Breadth-First Search (BFS)",
            subject: "Computer Science",
            topic: "DSA",
            description: "Learn the fundamentals of the Breadth-First Search algorithm and its applications in computer science.",
            chapters: [
                {
                    title: "BFS",
                    description: "Understanding the fundamentals of the Breadth-First Search algorithm and its applications in computer science.",
                    videoUrl: "https://res.cloudinary.com/dg1qs96lf/video/upload/v1770443848/e0c0779qqwo0epnlbb22.mp4", // Replace with your actual video URLs
                    duration: 60,
                },
                {
                    title: "Graphs",
                    description: "Introduction to graph theory and its applications",
                    videoUrl: "https://res.cloudinary.com/dg1qs96lf/video/upload/v1770443644/dbwtr8ydyubkxgohdsbr.mp4",
                    duration: 60,
                },
            ],
        },
        {
            title: "Deep Learning",
            subject: "Computer Science",
            topic: "Machine Learning",
            description: "Explore the fundamentals of deep learning and neural networks",
            chapters: [
                {
                    title: "Perceptron",
                    description: "Understanding the basics of the perceptron algorithm and its role in deep learning",
                    videoUrl: "https://res.cloudinary.com/dg1qs96lf/video/upload/v1770443640/i1trn0jas49n5snxc8x3.mp4",
                    duration: 60,
                },

            ],
        }

    ];

    for (const courseData of demoCourses) {
        const { chapters, ...courseInfo } = courseData;

        const course = await prisma.course.create({
            data: {
                ...courseInfo,
                teacherId: demoTeacher.id,
                status: "PUBLISHED",
                duration: 600,
                avatarId: "avatar_001",
                voiceId: "voice_en_us_female_01",
                targetAudience: "Students",
                ageGroup: "16-20",
                style: "Educational",
                tone: "Friendly",
                keywords: [courseInfo.subject, courseInfo.topic],
            },
        });

        // Create chapters for the course
        for (let i = 0; i < chapters.length; i++) {
            await prisma.chapter.create({
                data: {
                    ...chapters[i],
                    courseId: course.id,
                    orderIndex: i,
                    status: "PUBLISHED",
                },
            });
        }

        console.log(`✅ Created course: ${course.title}`);
    }

    console.log("🎉 Demo videos seeded successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error seeding demo videos:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

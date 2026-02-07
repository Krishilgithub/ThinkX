import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️  Removing all demo videos and courses...");

    // Delete all courses and chapters created by the demo teacher
    const demoTeacher = await prisma.teacher.findUnique({
        where: { email: "demo@thinkx.com" },
    });

    if (!demoTeacher) {
        console.log("❌ Demo teacher not found - nothing to delete");
        return;
    }

    // Delete all chapters first (due to foreign key constraints)
    const deletedChapters = await prisma.chapter.deleteMany({
        where: {
            course: {
                teacherId: demoTeacher.id,
            },
        },
    });

    console.log(`✅ Deleted ${deletedChapters.count} demo chapters`);

    // Delete all video jobs
    const deletedJobs = await prisma.videoJob.deleteMany({
        where: {
            chapter: {
                course: {
                    teacherId: demoTeacher.id,
                },
            },
        },
    });

    console.log(`✅ Deleted ${deletedJobs.count} video jobs`);

    // Delete all courses
    const deletedCourses = await prisma.course.deleteMany({
        where: {
            teacherId: demoTeacher.id,
        },
    });

    console.log(`✅ Deleted ${deletedCourses.count} demo courses`);

    // Optionally delete the demo teacher account
    // Uncomment if you want to remove the demo teacher as well
    // await prisma.teacher.delete({
    //     where: { id: demoTeacher.id },
    // });
    // console.log("✅ Deleted demo teacher account");

    console.log("🎉 All demo videos removed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error removing demo videos:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

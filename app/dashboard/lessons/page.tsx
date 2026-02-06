export const dynamic = "force-dynamic";
import { getLessons } from "@/actions/lesson";
import { MyLessonsClient } from "@/components/dashboard/MyLessonsClient";

export default async function MyLessonsPage() {
  const allLessons = await getLessons();
  return <MyLessonsClient initialLessons={allLessons} />;
}

export const dynamic = "force-dynamic";
import { getResources } from "@/actions/library";
import { LibraryClient } from "@/components/dashboard/LibraryClient";

export default async function LibraryPage() {
  const resources = await getResources();
  return <LibraryClient initialResources={resources} />;
}

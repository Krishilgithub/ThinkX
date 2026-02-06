export const dynamic = "force-dynamic";

import { getAnalyticsOverview } from "@/actions/analytics";
// Create a separate client component for charts to avoid "use client" in server component
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";

export default async function AnalyticsPage() {
  const stats = await getAnalyticsOverview();

  // Handling null data
  if (!stats) return <div>Failed to load analytics.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights into student performance and content engagement.
        </p>
      </div>

      <AnalyticsCharts
        retentionData={stats.retentionData}
        quizData={stats.quizData}
        engagementWeek={stats.engagementWeek}
      />
    </div>
  );
}

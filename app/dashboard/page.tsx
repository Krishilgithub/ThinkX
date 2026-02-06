export const dynamic = "force-dynamic";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
// import { LessonsTable } from "@/components/dashboard/LessonsTable"; // Refactor to CourseGrid later
import { QuickActions } from "@/components/dashboard/QuickActions";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { TasksList } from "@/components/dashboard/TasksList";

import { getAnalyticsOverview } from "@/actions/analytics";
import { getRecentCourses } from "@/actions/course";

export default async function DashboardPage() {
  const stats = await getAnalyticsOverview();
  const recentCourses = await getRecentCourses(5);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Professor. You have 3 pending tasks today.
          </p>
        </div>
      </div>

      {/* Section 1: Overview KPIs */}
      <section>
        <KpiGrid stats={stats} />
      </section>

      {/* Section 2: Activity & Performance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {stats ? (
            <ActivityChart data={stats.viewsOverTime} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <InsightsPanel />
        </div>
      </section>

      {/* Section 3: Quick Actions & Tasks */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <TasksList />
        </div>
      </section>

      {/* Section 4: Recent Courses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-heading">Recent Courses</h2>
        </div>
        {/* <LessonsTable lessons={recentLessons} /> // Needs refactor to CourseGrid */}
        <div className="text-muted-foreground">
          Course Grid Component Coming Soon...
        </div>
        <ul className="space-y-2 mt-2">
          {recentCourses.map((c: any) => (
            <li
              key={c.id}
              className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
            >
              <span className="font-medium">{c.title}</span> -{" "}
              <span className="text-sm text-muted-foreground">{c.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

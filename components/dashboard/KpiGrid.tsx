"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Clock,
  Eye,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
// import { kpiData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiStats {
  totalViews: number;
  avgEngagement: number;
  completionRate: number;
  viewsOverTime: { month: string; views: number }[];
}

interface KpiGridProps {
  stats: KpiStats | null;
}

const icons = {
  Video: Video,
  Clock: Clock,
  Eye: Eye,
  Zap: Zap,
};

export function KpiGrid({ stats }: KpiGridProps) {
  // Safe default if stats is null
  const safeStats = stats || {
    totalViews: 0,
    avgEngagement: 0,
    completionRate: 0,
    viewsOverTime: [],
  };

  // Transform to display format
  // Note: Trends are mocked for now since we don't have historical comparison data yet
  const displayData = [
    {
      title: "Total Views",
      value: safeStats.totalViews.toLocaleString(),
      icon: "Eye",
      trend: "+12.5%",
      trendUp: true,
      data:
        safeStats.viewsOverTime.map((d) => d.views).length > 0
          ? safeStats.viewsOverTime.map((d) => d.views)
          : [0, 0, 0, 0, 0, 0],
    },
    {
      title: "Avg. Engagement",
      value: `${safeStats.avgEngagement}%`,
      icon: "Zap",
      trend: "+4.3%",
      trendUp: true,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      title: "Completion Rate",
      value: `${safeStats.completionRate}%`,
      icon: "Video",
      trend: "-2.1%",
      trendUp: false,
      data: [40, 35, 50, 60, 70, 75, 78],
    },
    {
      title: "Total Watch Time",
      value: "124h", // Placeholder/Mock for now as analytics doesn't return hours formatted yet
      icon: "Clock",
      trend: "+8.2%",
      trendUp: true,
      data: [10, 25, 30, 45, 50, 60, 70],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayData.map((kpi) => {
        const Icon = icons[kpi.icon as keyof typeof icons] || Video;
        const trendColor = kpi.trendUp ? "text-green-500" : "text-red-500";
        const TrendIcon = kpi.trendUp ? ArrowUpRight : ArrowDownRight;

        return (
          <Card
            key={kpi.title}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p
                    className={cn("text-xs flex items-center mt-1", trendColor)}
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {kpi.trend}
                    <span className="text-muted-foreground ml-1">
                      from last month
                    </span>
                  </p>
                </div>
                {/* Micro Sparkline */}
                <div className="h-10 w-20 opacity-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpi.data.map((d) => ({ value: d }))}>
                      <defs>
                        <linearGradient
                          id={`gradient-${kpi.title}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={kpi.trendUp ? "#10B981" : "#EF4444"}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={kpi.trendUp ? "#10B981" : "#EF4444"}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={kpi.trendUp ? "#10B981" : "#EF4444"}
                        fill={`url(#gradient-${kpi.title})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

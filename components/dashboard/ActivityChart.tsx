"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChartData {
  month: string;
  views: number;
  [key: string]: any;
}

interface ActivityChartProps {
  data: ChartData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const [timeRange, setTimeRange] = useState("weekly");

  return (
    <Card className="col-span-2 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-7">
        <div>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>
            Lesson views and student engagement over time.
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("weekly")}
            className="h-8"
          >
            Weekly
          </Button>
          <Button
            variant={timeRange === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("monthly")}
            className="h-8"
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="month" // Changed from 'name' to 'month' based on analytics action
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                name="Total Views"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 6 }}
              />
              {/* Removed engagement line temporarily as data structure differs */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

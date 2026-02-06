"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const upcomingTasks = [
  {
    id: "1",
    title: "Review 'Introduction to AI' script",
    type: "Review",
    due: "Today",
  },
  {
    id: "2",
    title: "Approve 'Machine Learning Basics' video",
    type: "Approval",
    due: "Tomorrow",
  },
  {
    id: "3",
    title: "Update course thumbnail",
    type: "Task",
    due: "In 2 days",
  },
];

export function TasksList() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>To-dos for your next session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
          >
            <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{task.title}</p>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full border",
                    task.type === "Review"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : task.type === "Approval"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-gray-50 text-gray-700 border-gray-200",
                  )}
                >
                  {task.type}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.due}
                </span>
              </div>
            </div>
          </div>
        ))}
        {upcomingTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No pending tasks.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

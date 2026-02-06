"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Upload, MessageSquare, Video } from "lucide-react";

const actions = [
  {
    title: "New Lesson",
    description: "Create from scratch or AI",
    icon: PlusCircle,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Upload Video",
    description: "Processing & captions",
    icon: Upload,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Quiz Generator",
    description: "From existing content",
    icon: MessageSquare,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Start Live",
    description: "Launch virtual class",
    icon: Video,
    color: "bg-purple-100 text-purple-600",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary"
        >
          <CardHeader className="flex flex-row items-center space-y-0 pb-2 gap-3">
            <div
              className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium">
              {action.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {action.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

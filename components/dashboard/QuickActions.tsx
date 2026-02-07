"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "New Course",
    description: "Create from scratch with AI",
    icon: PlusCircle,
    color: "bg-orange-100 text-orange-600",
    href: "/dashboard/create",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary">
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
        </Link>
      ))}
    </div>
  );
}

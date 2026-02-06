"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, Eye, Trash, Save } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CourseHeaderProps {
  course: {
    id: string;
    title: string;
    status: string;
  };
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const router = useRouter();

  const handlePublish = () => {
    toast.success("Course published! (Demo)");
    // Call server action to update status
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/50 pb-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading tracking-tight">
              {course.title}
            </h1>
            <Badge
              variant={course.status === "PUBLISHED" ? "default" : "secondary"}
            >
              {course.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Course Setup & Curriculum
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Review mode coming soon")}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handlePublish} className="shadow-lg shadow-primary/20">
          <Save className="mr-2 h-4 w-4" />
          {course.status === "PUBLISHED" ? "Unpublish" : "Publish Course"}
        </Button>
      </div>
    </div>
  );
}

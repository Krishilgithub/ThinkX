"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  PlayCircle,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  status: string;
  enrollments?: any[]; // types...
  analytics: {
    totalViews: number;
    completionRate: number;
  } | null;
  _count?: {
    chapters: number;
    enrollments: number;
  };
  updatedAt: Date;
}

interface CourseGridProps {
  courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50"
        >
          <div className="relative aspect-video bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnail || "/placeholder.jpg"} // You might need a real placeholder asset
              alt={course.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <Badge
              className="absolute top-3 right-3 shadow-sm"
              variant={course.status === "PUBLISHED" ? "default" : "secondary"}
            >
              {course.status}
            </Badge>
          </div>

          <CardHeader className="p-4 pb-2">
            <h3 className="font-heading text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {course.description || "No description provided."}
            </p>
          </CardHeader>

          <CardContent className="p-4 pt-2 flex-grow">
            <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{course._count?.chapters || 0} Chapters</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{course._count?.enrollments || 0} Students</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border/40 mt-auto bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Updated {new Date(course.updatedAt).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              <Link href={`/dashboard/courses/${course.id}`}>
                <Button variant="outline" size="sm" className="h-8">
                  Manage
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Publish</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* Empty State / Add New Card */}
      <Link href="/dashboard/create" className="group">
        <Card className="h-full flex flex-col items-center justify-center p-6 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer min-h-[300px]">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
            <PlayCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Create New Course</h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Start building your next curriculum
          </p>
        </Card>
      </Link>
    </div>
  );
}

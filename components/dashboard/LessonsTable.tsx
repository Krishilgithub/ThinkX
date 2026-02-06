"use client";

// import { recentLessons } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, MoreHorizontal, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Lesson {
  id: string;
  title: string;
  status: string;
  views: number;
  duration: string | null;
  updatedAt: Date;
  thumbnail: string | null;
}

interface LessonsTableProps {
  lessons: Lesson[];
}

export function LessonsTable({ lessons }: LessonsTableProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[300px]">
                  Lesson Title
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Views
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Duration
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Last Edited
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 rounded overflow-hidden bg-muted relative shrink-0">
                        {/* Placeholder image logic or real image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={lesson.thumbnail || "/placeholder.jpg"}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                      <span className="truncate">{lesson.title}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        lesson.status === "Published"
                          ? "default"
                          : lesson.status === "Processing"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        lesson.status === "Published"
                          ? "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200"
                          : lesson.status === "Processing"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100/80 border-orange-200"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-100/80"
                      }
                    >
                      {lesson.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {lesson.views}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {lesson.duration}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {new Date(lesson.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

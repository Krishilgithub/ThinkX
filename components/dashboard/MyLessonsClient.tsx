"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Plus,
} from "lucide-react";
import { LessonsTable } from "@/components/dashboard/LessonsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  status: string;
  views: number;
  duration: string | null;
  updatedAt: Date;
  thumbnail: string | null;
}

function LessonsGrid({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <Card
          key={lesson.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50"
        >
          <div className="relative aspect-video bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lesson.thumbnail || "/placeholder.jpg"}
              alt={lesson.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            <Badge
              className={cn(
                "absolute top-3 right-3",
                lesson.status === "Published"
                  ? "bg-green-500 hover:bg-green-600"
                  : lesson.status === "Processing"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-slate-500 hover:bg-slate-600",
              )}
            >
              {lesson.status}
            </Badge>
          </div>
          <CardContent className="p-5">
            <h3 className="font-heading text-lg font-semibold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
              {lesson.title}
            </h3>
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{lesson.duration}</span>
              <span>{lesson.views} views</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground">
                Edited {new Date(lesson.updatedAt).toLocaleDateString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                Edit Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MyLessonsClient({
  initialLessons,
}: {
  initialLessons: Lesson[];
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLessons = initialLessons.filter((l) => {
    const matchesSearch = l.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      l.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
            My Lessons
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your library of AI-generated content.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Create New Lesson
          </Button>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex w-full md:w-auto items-center gap-2 flex-1">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background/50">
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg border border-border/50">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {view === "grid" ? (
        <LessonsGrid lessons={filteredLessons} />
      ) : (
        <LessonsTable lessons={filteredLessons} />
      )}
    </div>
  );
}

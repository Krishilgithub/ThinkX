"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createChapter } from "@/actions/chapter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { VideoItem } from "./VideoItem";
import { GenerateVideoModal } from "./GenerateVideoModal";
import { useRouter } from "next/navigation";

interface Chapter {
  id: string;
  title: string;
  videos: any[];
  orderIndex: number;
  status: string;
}

interface ChapterListProps {
  courseId: string;
  initialChapters: Chapter[];
}

export function ChapterList({ courseId, initialChapters }: ChapterListProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState(initialChapters);
  const [isCreating, setIsCreating] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!newChapterTitle.trim()) return;
    setLoading(true);
    try {
      const newChapter = await createChapter(courseId, newChapterTitle);
      setChapters([...chapters, { ...newChapter, videos: [] }]);
      setNewChapterTitle("");
      setIsCreating(false);
      toast.success("Chapter created");
    } catch (error) {
      toast.error("Failed to create chapter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold font-heading">
          Course Curriculum
        </h2>
        <Button
          variant="outline"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Chapter
        </Button>
      </div>

      {isCreating && (
        <Card className="border-dashed border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-top-2">
          <CardContent className="p-4 flex items-center gap-4">
            <Input
              placeholder="e.g. Introduction to React"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={loading}>
              Create
            </Button>
            <Button variant="ghost" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="group relative flex items-start gap-3 bg-card border border-border/50 rounded-xl p-4 hover:border-primary/20 transition-all"
          >
            <div className="mt-3 cursor-grab text-muted-foreground hover:text-foreground">
              <GripVertical className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-3">
                  {chapter.title}
                  <Badge
                    variant="outline"
                    className="text-xs font-normal text-muted-foreground"
                  >
                    {chapter.videos.length} Lessons
                  </Badge>
                </h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Video List */}
              <div className="pl-4 border-l-2 border-border/50 space-y-2 mt-4">
                {chapter.videos.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic py-2">
                    No lessons yet. Generate a video to start.
                  </div>
                ) : (
                  chapter.videos.map((video) => (
                    <VideoItem
                      key={video.id}
                      video={video}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))
                )}

                <div className="pt-2">
                  <GenerateVideoModal
                    chapterId={chapter.id}
                    onSuccess={() => {
                      router.refresh();
                      toast.success("Video generation started");
                    }}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground hover:text-primary"
                      >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Generate Video Lesson
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {chapters.length === 0 && !isCreating && (
          <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground">
            <p>No chapters yet. Start by adding one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

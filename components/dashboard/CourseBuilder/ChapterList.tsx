"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Pencil, Trash2, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createChapter } from "@/actions/chapter";
import { toast } from "sonner";
import { GenerateVideoModal } from "./GenerateVideoModal";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  status: string;
  duration: number | null;
  orderIndex: number;
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
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    description?: string;
  } | null>(null);

  const handleCreate = async () => {
    if (!newChapterTitle.trim()) return;
    setLoading(true);
    try {
      const newChapter = await createChapter({
        courseId,
        title: newChapterTitle
      });
      setChapters([...chapters, newChapter]);
      setNewChapterTitle("");
      setIsCreating(false);
      toast.success("Chapter created");
      router.refresh();
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
              placeholder="e.g. Introduction to Physics"
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
        {chapters.map((chapter) => (
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
                  <StatusBadge status={chapter.status} />
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

              {chapter.description && (
                <p className="text-sm text-muted-foreground">
                  {chapter.description}
                </p>
              )}

              {/* Video Section */}
              <div className="pl-4 border-l-2 border-border/50 space-y-2 mt-4">
                {chapter.videoUrl ? (
                  <div
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setSelectedVideo({
                      url: chapter.videoUrl!,
                      title: chapter.title,
                      description: chapter.description || undefined,
                    })}
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Video Generated</p>
                        {chapter.duration && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {Math.floor(chapter.duration / 60)}:{(chapter.duration % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-primary font-medium">
                      Click to view
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic py-2">
                    No video yet. Generate one to start.
                  </div>
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
                        {chapter.videoUrl ? "Regenerate Video" : "Generate Video"}
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

      {selectedVideo && (
        <VideoPlayer
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </div>
  );
}

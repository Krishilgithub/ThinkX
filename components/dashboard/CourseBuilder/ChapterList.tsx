"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Pencil, Trash2, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createChapter, updateChapter, deleteChapter, reorderChapters } from "@/actions/chapter";
import { toast } from "sonner";
import { GenerateVideoModal } from "./GenerateVideoModal";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex((c) => c.id === active.id);
      const newIndex = chapters.findIndex((c) => c.id === over.id);

      const reorderedChapters = arrayMove(chapters, oldIndex, newIndex);
      setChapters(reorderedChapters);

      try {
        const updates = reorderedChapters.map((chapter, index) => ({
          id: chapter.id,
          orderIndex: index,
        }));

        await reorderChapters(courseId, updates);
        toast.success("Chapters reordered");
        router.refresh();
      } catch (error) {
        toast.error("Failed to reorder chapters");
        setChapters(chapters); // Revert on error
      }
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setEditTitle(chapter.title);
    setEditDescription(chapter.description || "");
  };

  const handleSaveEdit = async () => {
    if (!editingChapter) return;
    
    setLoading(true);
    try {
      await updateChapter(editingChapter.id, {
        title: editTitle,
        description: editDescription || undefined,
      });
      
      setChapters(chapters.map(c => 
        c.id === editingChapter.id 
          ? { ...c, title: editTitle, description: editDescription || null }
          : c
      ));
      
      toast.success("Chapter updated");
      setEditingChapter(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update chapter");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chapterId: string) => {
    setLoading(true);
    try {
      await deleteChapter(chapterId, courseId);
      setChapters(chapters.filter(c => c.id !== chapterId));
      toast.success("Chapter deleted");
      setDeleteChapterId(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete chapter");
    } finally {
      setLoading(false);
    }
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter) => (
              <SortableChapterItem
                key={chapter.id}
                chapter={chapter}
                courseId={courseId}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteChapterId(id)}
                onVideoClick={(url, title, description) =>
                  setSelectedVideo({ url, title, description })
                }
                onVideoGenerated={() => router.refresh()}
              />
            ))}
          </SortableContext>
        </DndContext>

        {chapters.length === 0 && !isCreating && (
          <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground">
            <p>No chapters yet. Start by adding one above.</p>
          </div>
        )}
      </div>

      {/* Edit Chapter Dialog */}
      <Dialog open={!!editingChapter} onOpenChange={(open) => !open && setEditingChapter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>
              Update the chapter title and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Chapter title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Chapter description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingChapter(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading || !editTitle.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteChapterId} onOpenChange={(open) => !open && setDeleteChapterId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chapter and all associated content including generated videos. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteChapterId && handleDelete(deleteChapterId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

interface SortableChapterItemProps {
  chapter: Chapter;
  courseId: string;
  onEdit: (chapter: Chapter) => void;
  onDelete: (id: string) => void;
  onVideoClick: (url: string, title: string, description?: string) => void;
  onVideoGenerated: () => void;
}

function SortableChapterItem({
  chapter,
  courseId,
  onEdit,
  onDelete,
  onVideoClick,
  onVideoGenerated,
}: SortableChapterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-start gap-3 bg-card border border-border/50 rounded-xl p-4 hover:border-primary/20 transition-all"
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-3">
            {chapter.title}
            <StatusBadge status={chapter.status} />
          </h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(chapter)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(chapter.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {chapter.description && (
          <p className="text-sm text-muted-foreground">{chapter.description}</p>
        )}

        {/* Video Section */}
        <div className="pl-4 border-l-2 border-border/50 space-y-2 mt-4">
          {chapter.videoUrl ? (
            <div
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={() =>
                onVideoClick(
                  chapter.videoUrl!,
                  chapter.title,
                  chapter.description || undefined
                )
              }
            >
              <div className="flex items-center gap-3">
                <PlayCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Video Generated</p>
                  {chapter.duration && (
                    <p className="text-xs text-muted-foreground">
                      Duration: {Math.floor(chapter.duration / 60)}:
                      {(chapter.duration % 60).toString().padStart(2, "0")}
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
                onVideoGenerated();
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
  );
}

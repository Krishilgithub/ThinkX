"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
// import { CreateCourseForm } from "@/components/dashboard/CreateCourseForm"; // We need to create this later
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/actions/course";
import { toast } from "sonner"; // Assuming sonner is installed from previous steps
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const creationOptions = [
  {
    title: "New Course",
    description: "Start a new course curriculum from scratch.",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "AI Course Generator",
    description: "Generate a full course structure from a topic.",
    icon: Bot,
    color: "bg-orange-100 text-orange-600",
    badge: "Beta",
  },
];

export default function CreatePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (option === "New Course") {
      setIsDialogOpen(true);
    } else {
      toast.info("AI Generation feature coming soon!");
    }
  };

  const handleCreateCourse = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const course = await createCourse({ title });
      toast.success("Course created!");
      router.push(`/dashboard/courses/${course.id}`);
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Course Creator
        </div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-foreground">
          What would you like to create?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start building your educational empire. Create a course manually or
          let AI structure it for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {creationOptions.map((option) => (
          <Card
            key={option.title}
            onClick={() => handleSelect(option.title)}
            className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div
                className={cn(
                  "p-3 rounded-xl transition-transform group-hover:scale-110 duration-300",
                  option.color,
                )}
              >
                <option.icon className="h-6 w-6" />
              </div>
              {option.badge && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {option.badge}
                </span>
              )}
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl mb-2 font-heading group-hover:text-primary transition-colors">
                {option.title}
              </CardTitle>
              <CardDescription className="text-base">
                {option.description}
              </CardDescription>

              <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Start Creating <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name your Course</DialogTitle>
            <DialogDescription>
              Give your new course a catchy title. You can change this later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input
                placeholder="e.g. Advanced React Patterns"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse} disabled={loading || !title}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/actions/course";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simplified form state - only title and description
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleCreateCourse = async () => {
    if (!formData.title) {
      toast.error("Please enter a course title");
      return;
    }

    setLoading(true);
    try {
      const course = await createCourse({
        title: formData.title,
        subject: "General",
        topic: formData.title,
        description: formData.description,
        duration: 600,
        avatarId: "avatar_001",
        voiceId: "voice_en_us_female_01",
        targetAudience: "Students",
        ageGroup: "16-20",
        style: "Educational",
        tone: "Friendly",
        keywords: [],
      });
      toast.success("Course created!");
      router.push(`/dashboard/courses/${course.id}`);
    } catch (error) {
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Course Creator
        </div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          Create New Course
        </h1>
        <p className="text-muted-foreground">
          Start by giving your course a title and description
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Enter the course title and a brief description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Introduction to Artificial Intelligence"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief description of what this course will cover..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/courses")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCourse}
                disabled={loading || !formData.title}
              >
                {loading ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

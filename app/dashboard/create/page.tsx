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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    topic: "",
    description: "",
    duration: "600",
    avatarId: "avatar_001",
    voiceId: "voice_en_us_female_01",
    targetAudience: "Students",
    ageGroup: "16-20",
    style: "Educational",
    tone: "Friendly",
    keywords: "",
  });

  const handleCreateCourse = async () => {
    if (!formData.title || !formData.subject || !formData.topic) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const course = await createCourse({
        ...formData,
        duration: parseInt(formData.duration),
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
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
          Fill in the details for your video course. AI will generate content based on these parameters.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Provide the basic information for your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Course Title *</Label>
                <Input
                  placeholder="e.g. Introduction to AI & Physics"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  placeholder="e.g. Physics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Topic *</Label>
                <Input
                  placeholder="e.g. AI Applications"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of the course..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Duration (seconds)</Label>
                <Input
                  type="number"
                  placeholder="600"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Avatar ID</Label>
                <Select value={formData.avatarId} onValueChange={(v) => setFormData({ ...formData, avatarId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="avatar_001">Avatar 1 (Professional)</SelectItem>
                    <SelectItem value="avatar_002">Avatar 2 (Casual)</SelectItem>
                    <SelectItem value="avatar_003">Avatar 3 (Formal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Voice</Label>
                <Select value={formData.voiceId} onValueChange={(v) => setFormData({ ...formData, voiceId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voice_en_us_female_01">English (US) - Female</SelectItem>
                    <SelectItem value="voice_en_us_male_01">English (US) - Male</SelectItem>
                    <SelectItem value="voice_en_uk_female_01">English (UK) - Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Students">Students</SelectItem>
                    <SelectItem value="Professionals">Professionals</SelectItem>
                    <SelectItem value="Beginners">Beginners</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select value={formData.ageGroup} onValueChange={(v) => setFormData({ ...formData, ageGroup: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-15">10-15</SelectItem>
                    <SelectItem value="16-20">16-20</SelectItem>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="Adult">Adult (25+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={formData.style} onValueChange={(v) => setFormData({ ...formData, style: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={formData.tone} onValueChange={(v) => setFormData({ ...formData, tone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Motivational">Motivational</SelectItem>
                    <SelectItem value="Serious">Serious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Keywords (comma-separated)</Label>
                <Input
                  placeholder="e.g. AI, Physics, Machine Learning"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
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
                disabled={loading || !formData.title || !formData.subject || !formData.topic}
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

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
    description: "Create a video course with AI-generated content.",
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

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    if (option === "New Course") {
      setIsDialogOpen(true);
    } else {
      toast.info("AI Generation feature coming soon!");
    }
  };

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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Fill in the details for your video course. AI will generate content based on these parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
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

              <div className="space-y-2 col-span-2">
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

              <div className="space-y-2 col-span-2">
                <Label>Keywords (comma-separated)</Label>
                <Input
                  placeholder="e.g. AI, Physics, Machine Learning"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse} disabled={loading || !formData.title || !formData.subject || !formData.topic}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

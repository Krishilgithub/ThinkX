"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bot,
  Video,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateLessonForm } from "@/components/dashboard/CreateLessonForm";
import { useState } from "react";

const creationOptions = [
  {
    title: "AI Video Generation",
    description: "Generate a full video lesson from a simple topic or prompt.",
    icon: Bot,
    color: "bg-orange-100 text-orange-600",
    badge: "Most Popular",
  },
  {
    title: "Text to Video",
    description: "Convert your existing script or detailed notes into video.",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Record Yourself",
    description: "Record your screen and camera with AI enhancements.",
    icon: Video,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Upload & Enhance",
    description: "Upload an existing video for AI captioning and editing.",
    icon: Upload,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function CreateLessonPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          AI-Powered Creation
        </div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-foreground">
          What would you like to create?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a starting point and let our AI assist you in creating engaging
          educational content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {creationOptions.map((option) => (
          <Card
            key={option.title}
            onClick={() => setSelectedOption(option.title)}
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

      <CreateLessonForm
        open={!!selectedOption}
        onOpenChange={(open) => !open && setSelectedOption(null)}
        defaultType={selectedOption || undefined}
      />
    </div>
  );
}

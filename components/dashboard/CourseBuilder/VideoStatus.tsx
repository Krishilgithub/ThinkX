"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { pollVideoStatus } from "@/actions/video-generation";
import Image from "next/image";

interface VideoStatusProps {
  videoId: string;
  initialStatus: string;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
}

export function VideoStatus({
  videoId,
  initialStatus,
  thumbnailUrl,
  videoUrl,
}: VideoStatusProps) {
  const [status, setStatus] = useState(initialStatus);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrl);
  const [currentThumbnail, setCurrentThumbnail] = useState(thumbnailUrl);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (status === "PROCESSING" || status === "PENDING" || status === "DRAFT") {
      // Start mock progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 5));
      }, 1000);

      // Poll status
      intervalId = setInterval(async () => {
        const result = await pollVideoStatus(videoId);

        if (result.status && result.status !== status) {
          setStatus(result.status);
          if (result.videoUrl) setCurrentVideoUrl(result.videoUrl);
          if (result.thumbnail) setCurrentThumbnail(result.thumbnail);

          if (result.status === "COMPLETED" || result.status === "FAILED") {
            clearInterval(intervalId);
            clearInterval(progressInterval);
            setProgress(result.status === "COMPLETED" ? 100 : 0);
          }
        }
      }, 3000);

      return () => {
        clearInterval(intervalId);
        clearInterval(progressInterval);
      };
    }
  }, [videoId, status]);

  if (status === "COMPLETED" && currentVideoUrl) {
    return (
      <div className="relative group rounded-md overflow-hidden border bg-muted aspect-video">
        {currentThumbnail ? (
          <Image
            src={currentThumbnail}
            alt="Video Thumbnail"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black/10 flex items-center justify-center">
            <Clapperboard className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Button variant="secondary" size="sm" asChild>
            <a href={currentVideoUrl} target="_blank" rel="noopener noreferrer">
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-md border-destructive/20 bg-destructive/5 text-destructive">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-sm font-medium">Generation Failed</p>
        <p className="text-xs opacity-70 mt-1">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 border rounded-md bg-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">
            Generating Video...
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground mt-2">
        We are creating your AI avatar video. You can navigate away, this
        process handles itself.
      </p>
    </div>
  );
}

import { Clapperboard } from "lucide-react";

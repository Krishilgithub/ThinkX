/**
 * VideoJobStatus Component
 *
 * Displays real-time status of video generation job with progress,
 * error handling, and video player on completion
 */

"use client";

import { useVideoJobStatus } from "@/hooks/useVideoJobStatus";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

interface VideoJobStatusProps {
  jobId: string;
  onComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Loader2,
    color: "text-gray-500",
    description: "Job is queued and waiting to start",
  },
  PROCESSING: {
    label: "Processing",
    variant: "secondary" as const,
    icon: Loader2,
    color: "text-blue-500",
    description: "Generating your video...",
  },
  COMPLETED: {
    label: "Completed",
    variant: "success" as const,
    icon: CheckCircle,
    color: "text-green-500",
    description: "Video generated successfully!",
  },
  FAILED: {
    label: "Failed",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-500",
    description: "Video generation failed",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "outline" as const,
    icon: AlertCircle,
    color: "text-gray-500",
    description: "Job was cancelled",
  },
};

export function VideoJobStatus({
  jobId,
  onComplete,
  onError,
}: VideoJobStatusProps) {
  const { status, isLoading, error, refetch } = useVideoJobStatus(jobId);

  // Handle callbacks
  if (status?.status === "COMPLETED" && status.videoUrl && onComplete) {
    onComplete(status.videoUrl);
  }

  if (status?.status === "FAILED" && status.error && onError) {
    onError(status.error);
  }

  // Loading state
  if (isLoading && !status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Loading job status...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || !status) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Failed to Load Status
              </h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Could not connect to status stream"}
              </p>
            </div>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = statusConfig[status.status];
  const StatusIcon = config.icon;
  const isAnimating =
    status.status === "PENDING" || status.status === "PROCESSING";

  return (
    <Card>
      <CardContent className="py-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon
              className={`h-6 w-6 ${config.color} ${isAnimating ? "animate-spin" : ""}`}
            />
            <div>
              <Badge variant={config.variant}>{config.label}</Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {config.description}
              </p>
            </div>
          </div>

          {status.status === "PROCESSING" && (
            <span className="text-sm font-medium text-muted-foreground">
              {status.progress}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {status.status === "PROCESSING" && (
          <div className="space-y-2">
            <Progress value={status.progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              This may take 2-5 minutes depending on video length
            </p>
          </div>
        )}

        {/* Error Message */}
        {status.status === "FAILED" && status.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Error Details
                </p>
                <p className="text-sm text-muted-foreground">{status.error}</p>
                {status.errorCode && (
                  <p className="text-xs text-muted-foreground">
                    Code: {status.errorCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        {status.status === "COMPLETED" && status.videoUrl && (
          <div className="space-y-4">
            <VideoPlayer
              url={status.videoUrl}
              thumbnail={status.thumbnailUrl || undefined}
            />

            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a
                  href={status.videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Timestamp */}
        {status.timestamp && (
          <p className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(status.timestamp).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * useVideoJobStatus Hook
 *
 * React hook for real-time video generation job status updates via SSE
 */

import { useEffect, useState, useCallback } from "react";

export interface JobStatus {
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  progress: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  error?: string | null;
  errorCode?: string | null;
  timestamp?: string;
}

interface UseVideoJobStatusReturn {
  status: JobStatus | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to subscribe to real-time job status updates
 *
 * @param jobId - The video job ID to track
 * @param enabled - Whether to enable the subscription (default: true)
 * @returns Job status data, loading state, and refetch function
 */
export function useVideoJobStatus(
  jobId: string | null,
  enabled: boolean = true,
): UseVideoJobStatusReturn {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!jobId || !enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create EventSource for SSE
    const eventSource = new EventSource(`/api/videos/jobs/${jobId}/stream`);
    let hasReceivedData = false;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as JobStatus;
        setStatus(data);
        setIsLoading(false);
        hasReceivedData = true;

        // Auto-close on terminal states
        if (
          data.status === "COMPLETED" ||
          data.status === "FAILED" ||
          data.status === "CANCELLED"
        ) {
          setTimeout(() => {
            eventSource.close();
          }, 1000);
        }
      } catch (err) {
        console.error("[SSE] Parse error:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to parse status update"),
        );
      }
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] Connection error:", err);

      if (!hasReceivedData) {
        setError(new Error("Failed to connect to status stream"));
      }

      setIsLoading(false);
      eventSource.close();
    };

    // Cleanup
    return () => {
      eventSource.close();
    };
  }, [jobId, enabled, refetchTrigger]);

  return { status, isLoading, error, refetch };
}

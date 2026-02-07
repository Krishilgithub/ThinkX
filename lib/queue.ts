/**
 * Redis Queue Configuration
 *
 * Manages BullMQ queues for async video generation processing
 */

import { Queue, QueueOptions } from "bullmq";
import IORedis from "ioredis";

// Redis connection configuration
const connection = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
);

// Queue options
const queueOptions: QueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // Start with 5 seconds
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Remove after 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs for debugging
    },
  },
};

// Video generation queue
export const videoQueue = new Queue("video-generation", queueOptions);

// Job data interfaces
export interface VideoJobData {
  jobId: string;
  chapterId: string;
  params: {
    title: string;
    script: string;
    avatarId: string;
    voiceId?: string;
    background?: string;
    language?: string;
  };
}

// Queue event listeners
videoQueue.on("error", (error) => {
  console.error("[Queue] Error:", error);
});

videoQueue.on("waiting", (jobId) => {
  console.log(`[Queue] Job ${jobId} is waiting`);
});

export default videoQueue;

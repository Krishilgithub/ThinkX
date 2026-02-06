export interface CreateVideoParams {
  title: string;
  description?: string;
  tone?: string;
  language?: string;
  avatarId?: string;
  voiceId?: string;
  background?: string;
  visibility?: string;
}

export interface HeyGenJobStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  error?: string;
}

// Mock implementation for development without API key
const MOCK_DELAY = 5000; // 5 seconds to simulate processing

export class HeyGenService {
  private apiKey: string;
  private isMock: boolean;

  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY || "";
    this.isMock = !this.apiKey; // Only mock if no key is provided
  }

  async generateVideo(params: CreateVideoParams): Promise<string> {
    if (this.isMock) {
      console.log("[HeyGen Mock] Generating video:", params);
      return `mock_job_${Date.now()}`;
    }

    try {
      const payload = {
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: params.avatarId || "default-avatar-id",
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              text: {
                voice_id: params.voiceId || "2d5b0e6cf361460aa7fc47e3eee4bab2",
                input_text: params.description || params.title,
              },
            },
            background: {
              type: "color",
              value: params.background || "#ffffff",
            },
          },
        ],
        test: true,
        caption: false,
        title: params.title,
      };

      console.log(
        "[HeyGen] Sending payload:",
        JSON.stringify(payload, null, 2),
      );

      const response = await fetch("https://api.heygen.com/v2/video/generate", {
        method: "POST",
        headers: {
          "X-Api-Key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch (e) {
          errorBody = await response.text();
        }
        console.error(
          "HeyGen API Error Body:",
          JSON.stringify(errorBody, null, 2),
        );
        throw new Error(
          `HeyGen API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`,
        );
      }

      const data = await response.json();
      return data.data.video_id;
    } catch (error) {
      console.error("HeyGen Generation Failed:", error);
      throw error;
    }
  }

  async checkStatus(jobId: string): Promise<HeyGenJobStatus> {
    if (this.isMock) {
      // Simulate status progression based on time since job ID creation
      const timestamp = parseInt(jobId.split("_")[2]);
      const elapsed = Date.now() - timestamp;

      if (elapsed < MOCK_DELAY) {
        return { id: jobId, status: "processing" };
      } else {
        return {
          id: jobId,
          status: "completed",
          video_url: "https://cdn.heygen.com/videos/mock_video.mp4", // Placeholder
          thumbnail_url: "https://cdn.heygen.com/thumbnails/mock_thumb.jpg",
          duration: 60,
        };
      }
    }

    try {
      const response = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${jobId}`,
        {
          headers: {
            "X-Api-Key": this.apiKey,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HeyGen Status Error: ${response.statusText}`);
      }

      const data = await response.json();
      const status = data.data.status;

      return {
        id: jobId,
        status:
          status === "completed"
            ? "completed"
            : status === "failed"
              ? "failed"
              : "processing",
        video_url: data.data.video_url,
        thumbnail_url: data.data.thumbnail_url,
        duration: data.data.duration,
        error: data.data.error,
      };
    } catch (error) {
      console.error("HeyGen Status Check Failed:", error);
      throw error;
    }
  }
}

export const heyGenService = new HeyGenService();

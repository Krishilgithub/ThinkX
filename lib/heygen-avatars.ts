import { db } from "@/lib/db";

// HeyGen Avatar API Response Types
export interface HeyGenAvatarResponse {
  avatar_id: string;
  avatar_name: string;
  gender?: string;
  preview_image_url?: string;
  preview_video_url?: string;
  avatar_style?: string;
}

export interface Avatar {
  id: string;
  avatarId: string;
  avatarName: string;
  gender?: string | null;
  previewImageUrl?: string | null;
  previewVideoUrl?: string | null;
  avatarStyle: string;
  isPublic: boolean;
  isAvailable: boolean;
}

/**
 * Production-ready HeyGen Avatar Management Service
 *
 * Features:
 * - Fetches avatars from HeyGen API
 * - Caches results in PostgreSQL
 * - Validates avatar IDs before use
 * - Provides fallback mechanisms
 * - Comprehensive error handling
 */
export class HeyGenAvatarService {
  private apiKey: string;
  private baseUrl = "https://api.heygen.com";

  constructor() {
    this.apiKey = process.env.HEYGEN_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "[HeyGenAvatarService] No API key found. Service will operate in limited mode.",
      );
    }
  }

  /**
   * Fetch all avatars from HeyGen API
   * @returns Array of avatar objects from HeyGen
   */
  async fetchAvatarsFromAPI(): Promise<HeyGenAvatarResponse[]> {
    if (!this.apiKey) {
      throw new Error("HeyGen API key is not configured");
    }

    try {
      console.log("[HeyGenAvatarService] Fetching avatars from HeyGen API...");

      const response = await fetch(`${this.baseUrl}/v2/avatars`, {
        method: "GET",
        headers: {
          "X-Api-Key": this.apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HeyGen API Error: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = await response.json();
      const avatars = data.data?.avatars || [];

      console.log(
        `[HeyGenAvatarService] Fetched ${avatars.length} avatars from API`,
      );

      return avatars;
    } catch (error) {
      console.error(
        "[HeyGenAvatarService] Failed to fetch avatars from API:",
        error,
      );
      throw error;
    }
  }

  /**
   * Sync avatars from HeyGen API to database
   * This should be called periodically (e.g., every 6 hours)
   */
  async syncAvatarsToDatabase(): Promise<{
    success: boolean;
    synced: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let syncedCount = 0;

    try {
      const apiAvatars = await this.fetchAvatarsFromAPI();

      // Mark all existing avatars as unavailable first
      await db.heyGenAvatar.updateMany({
        data: { isAvailable: false },
      });

      // Upsert each avatar
      for (const apiAvatar of apiAvatars) {
        try {
          await db.heyGenAvatar.upsert({
            where: { avatarId: apiAvatar.avatar_id },
            update: {
              avatarName: apiAvatar.avatar_name,
              gender: apiAvatar.gender,
              previewImageUrl: apiAvatar.preview_image_url,
              previewVideoUrl: apiAvatar.preview_video_url,
              avatarStyle: apiAvatar.avatar_style || "normal",
              isAvailable: true,
              updatedAt: new Date(),
            },
            create: {
              avatarId: apiAvatar.avatar_id,
              avatarName: apiAvatar.avatar_name,
              gender: apiAvatar.gender,
              previewImageUrl: apiAvatar.preview_image_url,
              previewVideoUrl: apiAvatar.preview_video_url,
              avatarStyle: apiAvatar.avatar_style || "normal",
              isPublic: true,
              isAvailable: true,
            },
          });
          syncedCount++;
        } catch (error) {
          const errorMsg = `Failed to sync avatar ${apiAvatar.avatar_id}: ${error}`;
          console.error(`[HeyGenAvatarService] ${errorMsg}`);
          errors.push(errorMsg);
        }
      }

      console.log(
        `[HeyGenAvatarService] Sync completed: ${syncedCount} avatars synced`,
      );

      return {
        success: errors.length === 0,
        synced: syncedCount,
        errors,
      };
    } catch (error) {
      console.error("[HeyGenAvatarService] Sync failed:", error);
      return {
        success: false,
        synced: syncedCount,
        errors: [String(error)],
      };
    }
  }

  /**
   * Get all available avatars from database
   * @param includeUnavailable - Include avatars marked as unavailable
   */
  async getAvatars(includeUnavailable = false): Promise<Avatar[]> {
    try {
      const avatars = await db.heyGenAvatar.findMany({
        where: includeUnavailable ? {} : { isAvailable: true },
        orderBy: { avatarName: "asc" },
      });

      return avatars;
    } catch (error) {
      console.error(
        "[HeyGenAvatarService] Failed to fetch avatars from database:",
        error,
      );
      throw error;
    }
  }

  /**
   * Get a specific avatar by avatarId
   * @param avatarId - HeyGen avatar ID
   */
  async getAvatar(avatarId: string): Promise<Avatar | null> {
    try {
      const avatar = await db.heyGenAvatar.findUnique({
        where: { avatarId },
      });

      return avatar;
    } catch (error) {
      console.error(
        `[HeyGenAvatarService] Failed to fetch avatar ${avatarId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Validate if an avatar ID exists and is available
   * @param avatarId - HeyGen avatar ID to validate
   * @returns Validation result with avatar data or fallback
   */
  async validateAvatarId(avatarId: string): Promise<{
    valid: boolean;
    avatar?: Avatar;
    fallback?: Avatar;
    message?: string;
  }> {
    try {
      // Check if avatar exists in database
      const avatar = await this.getAvatar(avatarId);

      if (avatar && avatar.isAvailable) {
        return {
          valid: true,
          avatar,
        };
      }

      // Avatar not found or unavailable, get fallback
      console.warn(
        `[HeyGenAvatarService] Avatar ${avatarId} not found or unavailable`,
      );

      const fallback = await this.getDefaultAvatar();

      return {
        valid: false,
        fallback,
        message: avatar
          ? "Avatar is unavailable"
          : "Avatar not found in database",
      };
    } catch (error) {
      console.error(
        `[HeyGenAvatarService] Validation error for ${avatarId}:`,
        error,
      );

      // Return fallback on error
      const fallback = await this.getDefaultAvatar();

      return {
        valid: false,
        fallback,
        message: "Validation error occurred",
      };
    }
  }

  /**
   * Get the default avatar (first available avatar or from env variable)
   */
  async getDefaultAvatar(): Promise<Avatar> {
    try {
      // Try to get avatar from environment variable first
      const defaultAvatarId = process.env.HEYGEN_DEFAULT_AVATAR_ID;

      if (defaultAvatarId) {
        const avatar = await this.getAvatar(defaultAvatarId);
        if (avatar && avatar.isAvailable) {
          return avatar;
        }
      }

      // Fallback to first available avatar
      const avatars = await this.getAvatars();

      if (avatars.length === 0) {
        throw new Error("No avatars available in database. Please run sync.");
      }

      return avatars[0];
    } catch (error) {
      console.error(
        "[HeyGenAvatarService] Failed to get default avatar:",
        error,
      );
      throw new Error(
        "No default avatar available. Please sync avatars from HeyGen API.",
      );
    }
  }

  /**
   * Log invalid avatar usage attempt for monitoring
   * @param avatarId - Invalid avatar ID that was attempted
   * @param context - Additional context about where it was used
   */
  logInvalidAvatarAttempt(avatarId: string, context?: string): void {
    const logMessage = `[HeyGenAvatarService] Invalid avatar attempt: ${avatarId}`;
    const fullMessage = context
      ? `${logMessage} | Context: ${context}`
      : logMessage;

    console.warn(fullMessage);

    // TODO: Send to monitoring service (e.g., Sentry, DataDog)
    // Example: Sentry.captureMessage(fullMessage, 'warning');
  }
}

// Export singleton instance
export const heyGenAvatarService = new HeyGenAvatarService();

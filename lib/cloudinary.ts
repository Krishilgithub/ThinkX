/**
 * Cloudinary Service for Video Storage
 * Uploads generated videos to Cloudinary and returns permanent URLs
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadVideoResult {
    url: string;
    secureUrl: string;
    publicId: string;
    thumbnailUrl?: string;
    duration?: number;
    format: string;
    bytes: number;
}

export class CloudinaryService {
    private isConfigured: boolean;

    constructor() {
        this.isConfigured = !!(
            process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET
        );

        if (!this.isConfigured) {
            console.warn('[Cloudinary] Not configured - videos will use HeyGen URLs directly');
        }
    }

    /**
     * Upload video from URL to Cloudinary
     * @param videoUrl - The source video URL (from HeyGen or other source)
     * @param options - Upload options (folder, public_id, etc.)
     */
    async uploadVideoFromUrl(
        videoUrl: string,
        options: {
            folder?: string;
            publicId?: string;
            chapterId?: string;
        } = {}
    ): Promise<UploadVideoResult> {
        if (!this.isConfigured) {
            // Return original URL if Cloudinary is not configured
            console.log('[Cloudinary] Skipping upload - using original URL');
            return {
                url: videoUrl,
                secureUrl: videoUrl,
                publicId: 'not-uploaded',
                format: 'mp4',
                bytes: 0,
            };
        }

        try {
            console.log('[Cloudinary] Uploading video from URL:', videoUrl);

            const uploadOptions: any = {
                resource_type: 'video',
                folder: options.folder || 'thinkx-videos',
                overwrite: true,
                eager: [
                    { width: 1280, height: 720, crop: 'limit', format: 'mp4' },
                ],
                eager_async: true,
            };

            if (options.publicId) {
                uploadOptions.public_id = options.publicId;
            } else if (options.chapterId) {
                uploadOptions.public_id = `chapter-${options.chapterId}`;
            }

            const result = await cloudinary.uploader.upload(videoUrl, uploadOptions);

            console.log('[Cloudinary] Upload successful:', result.public_id);

            // Generate thumbnail URL
            const thumbnailUrl = cloudinary.url(result.public_id, {
                resource_type: 'video',
                format: 'jpg',
                transformation: [
                    { width: 640, height: 360, crop: 'fill' },
                    { quality: 'auto' },
                ],
            });

            return {
                url: result.url,
                secureUrl: result.secure_url,
                publicId: result.public_id,
                thumbnailUrl,
                duration: result.duration,
                format: result.format,
                bytes: result.bytes,
            };
        } catch (error: any) {
            console.error('[Cloudinary] Upload failed:', error.message);

            // Fallback to original URL if upload fails
            return {
                url: videoUrl,
                secureUrl: videoUrl,
                publicId: 'upload-failed',
                format: 'mp4',
                bytes: 0,
            };
        }
    }

    /**
     * Delete a video from Cloudinary
     */
    async deleteVideo(publicId: string): Promise<boolean> {
        if (!this.isConfigured) {
            return true;
        }

        try {
            await cloudinary.uploader.destroy(publicId, {
                resource_type: 'video',
            });
            console.log('[Cloudinary] Video deleted:', publicId);
            return true;
        } catch (error: any) {
            console.error('[Cloudinary] Delete failed:', error.message);
            return false;
        }
    }

    /**
     * Get video details from Cloudinary
     */
    async getVideoDetails(publicId: string): Promise<any> {
        if (!this.isConfigured) {
            return null;
        }

        try {
            const result = await cloudinary.api.resource(publicId, {
                resource_type: 'video',
            });
            return result;
        } catch (error: any) {
            console.error('[Cloudinary] Get details failed:', error.message);
            return null;
        }
    }
}

export const cloudinaryService = new CloudinaryService();

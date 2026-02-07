# Cloudinary Video Storage Integration

This guide explains how Cloudinary is integrated for storing user-generated videos.

## Overview

The platform uses a two-stage video approach:
1. **HeyGen** generates the video
2. **Cloudinary** stores the video permanently

This ensures:  
- User-generated videos are stored in your Cloudinary account
- Videos are accessible only to the user who generated them (shown in their dashboard)
- Pre-generated demo videos in the Library remain unchanged

## How It Works

### Video Generation Flow:

1. User creates a course and chapter
2. User triggers video generation
3. **HeyGen** generates the video (AI avatar + script)
4. System polls HeyGen for completion status
5. When complete, **automatically uploads to Cloudinary**
6. Cloudinary URL is stored in the database
7. Video appears in the user's "Recent Videos" on their dashboard

### Library vs Dashboard:

- **Dashboard "Recent Videos"** - Shows the logged-in user's generated videos (stored in Cloudinary)
- **Library** - Shows all published demo/template videos (from seed data or admin uploads)

## Setup Cloudinary

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signup, you'll see your dashboard

### 2. Get Your Credentials

From your Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `your-cloud-name`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### 3. Add to Environment Variables

Edit your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 4. Install Dependencies

```bash
npm install
```

This will install the `cloudinary` package that was added to package.json.

### 5. Restart Your Development Server

```bash
npm run dev
```

## Features

### Automatic Upload:
- Videos are automatically uploaded to Cloudinary when HeyGen completes generation
- No manual intervention needed
- Thumbnail images are auto-generated

### Fallback Mechanism:
- If Cloudinary credentials are not configured, videos will use HeyGen URLs directly
- If Cloudinary upload fails, videos will fall back to HeyGen URLs
- System continues to work even without Cloudinary

### Video Organization:
- All videos are stored in the `thinkx-videos` folder in Cloudinary
- Each video is named with its chapter ID for easy identification
- Format: `chapter-{uuid}`

### Video Optimization:
- Videos are optimized for web delivery
- Automatic format conversion (MP4)
- Thumbnail generation for preview
- Responsive quality based on viewer's connection

## Cloudinary Dashboard

### Viewing Your Videos:
1. Go to [https://console.cloudinary.com](https://console.cloudinary.com)
2. Navigate to **Media Library** > **Videos**
3. Find your videos in the `thinkx-videos` folder

### Video Details:
- Each video shows its public ID, size, duration, and format
- Click any video to see transformations and delivery URLs
- Copy URLs for use elsewhere if needed

## Storage & Pricing

### Free Tier Includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 2,500 transformations/month

### For Production:
- Consider upgrading if you expect high usage
- See [Cloudinary Pricing](https://cloudinary.com/pricing) for options

## Security

### Environment Variables:
- Never commit `.env` file to git
- Keep API credentials secret
- Add `.env` to `.gitignore`

### Video Access:
- Cloudinary URLs are public by default
- Each user only sees their own videos in the dashboard
- Implement signed URLs for private videos if needed

## Troubleshooting

### Videos not uploading?
1. Check console logs for `[Cloudinary]` messages
2. Verify credentials in `.env` file
3. Ensure HeyGen is completing video generation first
4. Check Cloudinary dashboard quota limits

### Using original HeyGen URLs?
This happens when:
- Cloudinary credentials are missing
- Upload fails (check logs)
- System falls back to HeyGen URL automatically

### Need help?
- Check Cloudinary logs in console
- View HeyGen generation status
- Verify database `chapter.videoUrl` field

## Code References

- **Cloudinary Service**: `lib/cloudinary.ts`
- **Video Generation**: `actions/video-generation.ts`
- **Environment Config**: `.env`

## Important Notes

✅ **User videos** are uploaded to Cloudinary (shown in their dashboard)
✅ **Library demo videos** remain unchanged (seeded data or manual uploads)
✅ System works with or without Cloudinary configured
✅ Automatic fallback to HeyGen URLs if Cloudinary fails

---

For more information about Cloudinary:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Video Upload API](https://cloudinary.com/documentation/video_upload_api_reference)
- [Transformations](https://cloudinary.com/documentation/video_transformations)

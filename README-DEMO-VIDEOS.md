# Demo Videos Setup

This guide explains how to add pre-generated demo videos to your ThinkX platform.

## Overview

The platform now supports displaying pre-generated videos to all users in the **Library** section. These videos are visible to anyone who signs up or creates an account.

## How It Works

1. **Dashboard** - Shows a "Create New Course" quick action card at the top
2. **Library** - Displays all published videos from all teachers (pre-generated content)
3. Users can browse and watch demo videos for inspiration

## Adding Demo Videos

### Option 1: Using the Seed Script (Recommended)

1. **Edit the video URLs** in `prisma/seed-demo-videos.ts`:
   - Replace the example URLs with your actual video URLs
   - Update titles, descriptions, and duration as needed

2. **Run the seed script**:
   ```bash
   npx tsx prisma/seed-demo-videos.ts
   ```

### Option 2: Manual Database Entry

You can manually add videos through the database:

1. Create a demo teacher account (or use an existing one)
2. Create courses with status "PUBLISHED"
3. Add chapters to those courses with:
   - `videoUrl` - Your video URL
   - `status` - Set to "PUBLISHED"
   - `duration` - Video duration in seconds

### Option 3: Using the UI

1. Create a teacher account for demo content (e.g., `demo@thinkx.com`)
2. Log in and create courses normally
3. Add chapters and generate/upload videos
4. Make sure to set both Course and Chapter status to "PUBLISHED"

## Video Requirements

For videos to appear in the Library:
- ✅ Course status must be "PUBLISHED"
- ✅ Chapter status must be "PUBLISHED"
- ✅ Chapter must have a `videoUrl` set
- ✅ Video URL should be accessible

## Customizing Demo Content

Edit the `demoCourses` array in `prisma/seed-demo-videos.ts` to add your own:
- Course titles and descriptions
- Subject areas
- Video chapters
- Video URLs (from your video hosting service)

## Video Hosting

You can use:
- **HeyGen** - AI-generated videos (already integrated)
- **YouTube** - Embed links
- **Vimeo** - Professional hosting
- **AWS S3** - Self-hosted
- **Cloudflare Stream** - CDN delivery
- Any publicly accessible video URL

## Example Video Structure

```typescript
{
  title: "Your Course Title",
  subject: "Subject Area",
  topic: "Specific Topic",
  description: "Course description",
  chapters: [
    {
      title: "Chapter 1 Title",
      description: "Chapter description",
      videoUrl: "https://your-video-host.com/video1.mp4",
      duration: 480, // in seconds
    },
  ],
}
```

## Current Demo Videos

The seed script includes example courses in:
- Computer Science (AI & Machine Learning)
- Physics (Laws of Motion)
- Programming (Python)
- History (Ancient Civilizations)

Replace these with your actual pre-generated content!

## Notes

- Videos in the library are public and visible to all users
- Users cannot edit demo videos (they're owned by the demo teacher)
- Demo videos serve as templates and inspiration for new users
- Update video URLs regularly to ensure they remain accessible

# How to Upload Pre-Recorded Videos to ThinkX

This guide shows you exactly how to upload your pre-recorded videos so all users can see them in the Library.

## Quick Overview

1. Upload your videos to Cloudinary
2. Get the video URLs
3. Update the seed script with your URLs
4. Run the seed script
5. Videos appear in the Library

---

## Step-by-Step Guide

### Step 1: Upload Videos to Cloudinary

#### Option A: Using Cloudinary Dashboard (Recommended)

1. **Go to Cloudinary Console**
   - Visit: https://console.cloudinary.com
   - Log in with your credentials

2. **Navigate to Media Library**
   - Click "Media Library" in the left sidebar
   - Click "Upload" button

3. **Upload Your Videos**
   - Click "Select Files" or drag & drop your video files
   - Choose folder: `demo-videos` (or create a new folder)
   - Wait for upload to complete

4. **Get Video URLs**
   - Click on each uploaded video
   - Copy the "Secure URL" (starts with `https://res.cloudinary.com/`)
   - Save these URLs - you'll need them next

**Example URL:**
```
https://res.cloudinary.com/your-cloud-name/video/upload/v1234567890/demo-videos/ai-intro.mp4
```

#### Option B: Using Cloudinary CLI

```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Configure
cld config

# Upload a video
cld uploader upload path/to/your/video.mp4 -f demo-videos
```

---

### Step 2: Update the Seed Script

1. **Open the seed file**
   - File: `prisma/seed-demo-videos.ts`

2. **Replace the example URLs with your Cloudinary URLs**

**Before:**
```typescript
{
    title: "What is Artificial Intelligence?",
    description: "Understanding the fundamentals of AI",
    videoUrl: "https://example.com/ai-intro.mp4", // ❌ Example URL
    duration: 480,
}
```

**After:**
```typescript
{
    title: "What is Artificial Intelligence?",
    description: "Understanding the fundamentals of AI",
    videoUrl: "https://res.cloudinary.com/your-cloud/video/upload/v123/demo-videos/ai-intro.mp4", // ✅ Your URL
    duration: 480,
}
```

3. **Update all video URLs in the `demoCourses` array**

4. **Customize course content** (optional)
   - Change titles, descriptions
   - Add/remove courses
   - Add/remove chapters
   - Update durations (in seconds)

**Example with your own content:**
```typescript
{
    title: "Marketing Fundamentals",
    subject: "Business",
    topic: "Digital Marketing",
    description: "Learn the basics of digital marketing",
    chapters: [
        {
            title: "Introduction to SEO",
            description: "Search engine optimization basics",
            videoUrl: "https://res.cloudinary.com/your-cloud/video/upload/v123/marketing-seo.mp4",
            duration: 420,
        },
        {
            title: "Social Media Marketing",
            description: "Marketing on social platforms",
            videoUrl: "https://res.cloudinary.com/your-cloud/video/upload/v123/marketing-social.mp4",
            duration: 380,
        },
    ],
}
```

---

### Step 3: Run the Seed Script

```bash
npm run seed:demo
```

**You should see:**
```
🌱 Seeding demo videos...
✅ Demo teacher created
✅ Created course: Introduction to Artificial Intelligence
✅ Created course: Physics: Laws of Motion
✅ Created course: Marketing Fundamentals
🎉 Demo videos seeded successfully!
```

---

### Step 4: Verify Videos Appear

1. **Start your development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   ```
   http://localhost:3000
   ```

3. **Log in or create an account**

4. **Go to Library**:
   - Click "Library" in the sidebar
   - You should see all your uploaded videos

---

## Alternative Methods

### Method 2: Manual Upload via Cloudinary Widget (For Users)

If you want users to upload videos through the UI, you can integrate Cloudinary Upload Widget:

1. **Install Cloudinary React SDK**:
   ```bash
   npm install @cloudinary/react @cloudinary/url-gen
   ```

2. **Create an upload component** (I can help you with this if needed)

### Method 3: Direct Database Entry

For advanced users who want to add videos directly:

```bash
# Connect to your database
psql $DATABASE_URL

# Or use a GUI like Prisma Studio
npx prisma studio
```

Then manually create Course and Chapter records with `status: "PUBLISHED"`.

---

## Video Format Requirements

### Supported Formats:
- MP4 (recommended)
- WebM
- MOV
- AVI (will be converted)

### Recommended Settings:
- **Resolution**: 1280x720 (HD) or 1920x1080 (Full HD)
- **Codec**: H.264
- **Audio**: AAC
- **Bitrate**: 2-5 Mbps
- **Frame Rate**: 30fps or 60fps

### File Size:
- Cloudinary free tier: Up to 100MB per file
- For larger files: Split into chapters or upgrade plan

---

## Tips & Best Practices

### 1. Organize Your Videos
```
demo-videos/
  ├── ai/
  │   ├── intro.mp4
  │   └── ml-basics.mp4
  ├── physics/
  │   ├── newtons-first.mp4
  │   └── newtons-second.mp4
  └── programming/
      └── python-intro.mp4
```

### 2. Use Consistent Naming
- Use lowercase
- Separate words with hyphens
- Be descriptive: `ai-machine-learning-intro.mp4`

### 3. Generate Thumbnails
Cloudinary auto-generates thumbnails, or you can customize:
```
https://res.cloudinary.com/your-cloud/video/upload/so_2.0/demo-videos/ai-intro.jpg
```

### 4. Video Duration
Get video duration using ffmpeg:
```bash
ffmpeg -i your-video.mp4 2>&1 | grep Duration
```

Or use online tools like: https://www.metadata2go.com/

### 5. Test Before Seeding
- Upload one video first
- Copy the URL
- Test it in a browser
- Make sure it plays correctly

---

## Troubleshooting

### Videos not showing in Library?

**Check:**
1. Course status is `PUBLISHED`
2. Chapter status is `PUBLISHED`
3. `videoUrl` is set and accessible
4. Seed script ran without errors

**View in database:**
```bash
npx prisma studio
```
Navigate to Chapter table and verify the data.

### Seed script fails?

**Common issues:**
1. Database connection error - check `DATABASE_URL` in `.env`
2. Missing dependency - run `npm install`
3. Syntax error in seed file - check your JSON structure

### Videos won't play?

**Check:**
1. URL is public and accessible
2. CORS is enabled on Cloudinary
3. Video format is supported
4. No typos in the URL

### Cloudinary quota exceeded?

**Solutions:**
1. Check usage in Cloudinary dashboard
2. Delete old test videos
3. Optimize video sizes
4. Upgrade Cloudinary plan

---

## Quick Reference: Complete Example

Here's a complete example with real Cloudinary URLs:

```typescript
{
    title: "Web Development Bootcamp",
    subject: "Programming",
    topic: "Web Development",
    description: "Complete web development course",
    chapters: [
        {
            title: "HTML Fundamentals",
            description: "Learn HTML5 basics",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/samples/sea-turtle.mp4",
            duration: 300,
        },
        {
            title: "CSS Styling",
            description: "Master CSS styling",
            videoUrl: "https://res.cloudinary.com/demo/video/upload/samples/elephants.mp4",
            duration: 350,
        },
    ],
}
```

---

## Need Help?

1. **Check Cloudinary logs**: Console tab in browser
2. **Check server logs**: Terminal where `npm run dev` is running
3. **Verify database**: Use `npx prisma studio`
4. **Test URLs**: Open video URLs directly in browser

---

## Summary Checklist

✅ Cloudinary account created and configured
✅ Videos uploaded to Cloudinary
✅ Video URLs copied
✅ Seed script updated with your URLs
✅ Course/chapter details customized
✅ Seed script executed successfully
✅ Videos visible in Library
✅ Videos play correctly

**You're all set!** Your pre-recorded videos are now available to all users in the Library.

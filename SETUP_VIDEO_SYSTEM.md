## Environment Variables for Production Video System

Add these to your `.env` file:

```bash
# Redis Configuration (Required for background workers)
REDIS_URL="redis://localhost:6379"
# For production, use Redis Cloud or similar:
# REDIS_URL="redis://default:password@redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com:12345"

# HeyGen Webhook Secret (Required for webhook verification)
HEYGEN_WEBHOOK_SECRET="your-webhook-secret-here"
# Get this from HeyGen dashboard when configuring webhooks

# Existing environment variables (keep these)
DATABASE_URL="your-existing-database-url"
HEYGEN_API_KEY="your-heygen-api-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Setup Instructions

### 1. Install Redis

**Local Development:**

```bash
# Windows (using Chocolatey)
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

**Production:**

- Use Redis Cloud: https://redis.com/try-free/
- Or AWS ElastiCache
- Or Upstash Redis

### 2. Run Database Migration

```bash
# Stop dev server first
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 3. Start Worker Process

The worker needs to run separately from your Next.js app:

```bash
# Create worker start script
node --loader ts-node/esm lib/workers/video-worker.ts
```

Or add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "worker": "tsx watch lib/workers/video-worker.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run worker\""
  }
}
```

Then install concurrently:

```bash
npm install --save-dev concurrently tsx
```

Run both:

```bash
npm run dev:all
```

### 4. Configure HeyGen Webhook

1. Go to HeyGen Dashboard → Webhooks
2. Add webhook URL: `https://yourapp.com/api/webhooks/heygen`
3. Copy the webhook secret to `HEYGEN_WEBHOOK_SECRET`
4. For local testing, use ngrok or similar:
   ```bash
   ngrok http 3000
   # Use the ngrok URL: https://abc123.ngrok.io/api/webhooks/heygen
   ```

## Testing the System

### 1. Create a Video Job

```bash
curl -X POST http://localhost:3000/api/videos/generate \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": "your-chapter-id",
    "title": "Test Video",
    "script": "This is a test video script",
    "avatarId": "your-avatar-id",
    "language": "en"
  }'
```

### 2. Check Job Status

```bash
curl http://localhost:3000/api/videos/jobs/{job-id}
```

### 3. Stream Real-time Updates

```bash
curl -N http://localhost:3000/api/videos/jobs/{job-id}/stream
```

## Production Deployment

### Worker Deployment

**Option 1: Same Server**

- Run worker alongside Next.js using PM2 or similar

**Option 2: Separate Worker Server**

- Deploy worker to separate instance/container
- Scale workers independently

**Option 3: Serverless Workers** (Advanced)

- Use AWS ECS/Fargate for worker containers
- Or deploy to Railway/Render with worker dyno

### Monitoring

Monitor these metrics:

- Queue depth (`videoQueue.count()`)
- Job success/failure rates
- Average processing time
- Worker health

Use tools like:

- BullMQ Dashboard: https://github.com/felixmosh/bull-board
- Redis Commander for queue inspection
- Application logs in production

## Troubleshooting

**Worker not processing jobs:**

- Check Redis connection
- Verify REDIS_URL is correct
- Check worker logs

**Webhooks not received:**

- Verify webhook URL is accessible
- Check HEYGEN_WEBHOOK_SECRET matches
- Test with ngrok for local development

**Database migration issues:**

- Stop dev server before running migration
- Clear Prisma cache: `npx prisma generate`
- Restart dev server after migration

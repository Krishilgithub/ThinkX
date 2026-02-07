-- =====================================================
-- Production Video Generation System - Database Migration
-- Run this SQL directly in Supabase SQL Editor
-- =====================================================

-- 1. Update VideoJob table with production-ready fields
-- Drop existing table constraints if they exist
ALTER TABLE "VideoJob" DROP CONSTRAINT IF EXISTS "VideoJob_heygenJobId_key";

-- Add new columns to VideoJob table
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "heygenJobId_new" TEXT UNIQUE;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "errorCode" TEXT;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "retryCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "maxRetries" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "nextRetryAt" TIMESTAMP(3);
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "duration" INTEGER;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "background" TEXT;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "language" TEXT;
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "webhookReceivedAt" TIMESTAMP(3);
ALTER TABLE "VideoJob" ADD COLUMN IF NOT EXISTS "webhookPayload" JSONB;

-- Migrate existing heygenJobId to new unique column
UPDATE "VideoJob" SET "heygenJobId_new" = "heygenJobId" WHERE "heygenJobId" IS NOT NULL;

-- Drop old column and rename new one
ALTER TABLE "VideoJob" DROP COLUMN IF EXISTS "heygenJobId";
ALTER TABLE "VideoJob" RENAME COLUMN "heygenJobId_new" TO "heygenJobId";

-- Modify startedAt to be nullable
ALTER TABLE "VideoJob" ALTER COLUMN "startedAt" DROP NOT NULL;
ALTER TABLE "VideoJob" ALTER COLUMN "startedAt" DROP DEFAULT;

-- Create indexes for VideoJob
CREATE INDEX IF NOT EXISTS "VideoJob_heygenJobId_idx" ON "VideoJob"("heygenJobId");
CREATE INDEX IF NOT EXISTS "VideoJob_nextRetryAt_idx" ON "VideoJob"("nextRetryAt");
CREATE INDEX IF NOT EXISTS "VideoJob_createdAt_idx" ON "VideoJob"("createdAt");

-- 2. Create JobEvent table for audit trail
CREATE TABLE IF NOT EXISTS "JobEvent" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobEvent_pkey" PRIMARY KEY ("id")
);

-- Create indexes for JobEvent
CREATE INDEX IF NOT EXISTS "JobEvent_jobId_idx" ON "JobEvent"("jobId");
CREATE INDEX IF NOT EXISTS "JobEvent_eventType_idx" ON "JobEvent"("eventType");
CREATE INDEX IF NOT EXISTS "JobEvent_createdAt_idx" ON "JobEvent"("createdAt");

-- Add foreign key constraint
ALTER TABLE "JobEvent" ADD CONSTRAINT "JobEvent_jobId_fkey" 
    FOREIGN KEY ("jobId") REFERENCES "VideoJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Verify VideoJob table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'VideoJob' 
ORDER BY ordinal_position;

-- Verify JobEvent table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'JobEvent' 
ORDER BY ordinal_position;

-- Verify indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('VideoJob', 'JobEvent') 
ORDER BY tablename, indexname;

-- Success message
SELECT 'Migration completed successfully! ✅' as status;

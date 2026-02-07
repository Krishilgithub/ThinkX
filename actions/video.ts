// This file is deprecated - Video model no longer exists
// Videos are now stored directly in Chapter.videoUrl
// Use actions/chapter.ts and actions/video-generation.ts instead

export async function getVideos() {
  return [];
}

export async function createVideo() {
  throw new Error("Video model deprecated - use Chapter with videoUrl instead");
}

export async function getGlobalRecentVideos() {
  return [];
}

import { NextResponse } from "next/server";
import { heyGenAvatarService } from "@/lib/heygen-avatars";

/**
 * POST /api/heygen/avatars/sync
 *
 * Manually trigger avatar sync from HeyGen API to database
 * This endpoint should be protected in production (admin-only)
 *
 * Response:
 * {
 *   success: boolean,
 *   synced: number,
 *   errors: string[]
 * }
 */
export async function POST() {
  try {
    console.log("[API /api/heygen/avatars/sync] Starting manual sync...");

    const result = await heyGenAvatarService.syncAvatarsToDatabase();

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("[API /api/heygen/avatars/sync] Error:", error);

    return NextResponse.json(
      {
        success: false,
        synced: 0,
        errors: [String(error)],
      },
      { status: 500 },
    );
  }
}

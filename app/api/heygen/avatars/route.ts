import { NextResponse } from "next/server";
import { heyGenAvatarService } from "@/lib/heygen-avatars";

/**
 * GET /api/heygen/avatars
 *
 * Returns list of available HeyGen avatars from database cache
 *
 * Response:
 * {
 *   success: boolean,
 *   avatars: Avatar[],
 *   count: number
 * }
 */
export async function GET() {
  try {
    const avatars = await heyGenAvatarService.getAvatars();

    return NextResponse.json(
      {
        success: true,
        avatars,
        count: avatars.length,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("[API /api/heygen/avatars] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch avatars",
        avatars: [],
        count: 0,
      },
      { status: 500 },
    );
  }
}

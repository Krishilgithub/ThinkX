/**
 * HeyGen Avatar Sync Script
 *
 * This script syncs avatars from the HeyGen API to the database.
 * It should be run periodically (e.g., every 6 hours) via cron job.
 *
 * Usage:
 *   node scripts/sync-heygen-avatars.mjs
 *
 * Or via npm script:
 *   npm run sync-avatars
 */

import { heyGenAvatarService } from "../lib/heygen-avatars.js";

async function main() {
  console.log("=".repeat(60));
  console.log("HeyGen Avatar Sync - Starting");
  console.log("=".repeat(60));
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    const result = await heyGenAvatarService.syncAvatarsToDatabase();

    console.log("\n" + "=".repeat(60));
    console.log("Sync Results:");
    console.log("=".repeat(60));
    console.log(`Success: ${result.success}`);
    console.log(`Avatars Synced: ${result.synced}`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log("\nErrors:");
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    console.log("\n" + "=".repeat(60));
    console.log(`Completed at: ${new Date().toISOString()}`);
    console.log("=".repeat(60));

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("FATAL ERROR:");
    console.error("=".repeat(60));
    console.error(error);
    console.error("\n" + "=".repeat(60));
    process.exit(1);
  }
}

main();

"use server";

import { db } from "@/lib/db";

// Hardcoded for demo - in real app would get from session
const DEMO_EMAIL = "demo@thinkx.ai";

export async function getDemoUser() {
  const user = await db.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: {
      settings: true,
    },
  });
  return user;
}

export async function updateSettings(data: {
  emailNotify?: boolean;
  studentNotify?: boolean;
  marketingNotify?: boolean;
}) {
  const user = await getDemoUser();
  if (!user) return null;

  return await db.settings.update({
    where: { userId: user.id },
    data: data,
  });
}

export async function updateProfile(data: { name?: string; bio?: string }) {
  const user = await getDemoUser();
  if (!user) return null;

  return await db.user.update({
    where: { id: user.id },
    data: data,
  });
}

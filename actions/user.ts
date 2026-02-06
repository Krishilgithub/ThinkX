"use server";

import { db } from "@/lib/db";

// Hardcoded for demo - in real app would get from session/auth
const DEMO_EMAIL = "demo@thinkx.ai";

export async function getDemoUser() {
  const teacher = await db.teacher.findUnique({
    where: { email: DEMO_EMAIL },
  });
  return teacher;
}

export async function updateProfile(data: { name?: string; bio?: string; avatar?: string }) {
  const teacher = await getDemoUser();
  if (!teacher) return null;

  return await db.teacher.update({
    where: { id: teacher.id },
    data: data,
  });
}

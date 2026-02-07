"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/auth";

export async function updateProfile(data: { name?: string; bio?: string; avatar?: string }) {
  const teacher = await getCurrentUser();
  if (!teacher) return null;

  return await db.teacher.update({
    where: { id: teacher.id },
    data: data,
  });
}

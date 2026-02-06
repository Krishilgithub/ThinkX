"use server";

import { db } from "@/lib/db";
import { getDemoUser } from "./user";

export async function getResources() {
  const user = await getDemoUser();
  if (!user) return [];

  return await db.resource.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });
}

export async function createResource(data: {
  name: string;
  type: string;
  url: string;
  size?: string;
}) {
  const user = await getDemoUser();
  if (!user) throw new Error("User not found");

  return await db.resource.create({
    data: {
      ...data,
      userId: user.id,
      date: new Date(),
    },
  });
}

export async function deleteResource(id: string) {
  return await db.resource.delete({
    where: { id },
  });
}

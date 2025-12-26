"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN"
) {
  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

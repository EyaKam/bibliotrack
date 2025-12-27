"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { workflowClient } from "@/lib/workflow"; 
import config from "@/lib/config";

export const approveUser = async (userId: string) => {
  try {
    const result = await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId))
      .returning();

    const updatedUser = result[0];
    if (!updatedUser) return { success: false, message: "User not found" };

    // Wrap this in a separate try/catch
    try {
      await workflowClient.trigger({
        url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
        body: {
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          status: "APPROVED",
        },
      });
    } catch (workflowError) {
      console.error("Workflow Trigger Failed, but user was approved:", workflowError);
      // We don't return false here because the DB update actually worked!
    }

    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Approval Error:", error);
    return { success: false };
  }
};

export const rejectUser = async (userId: string) => {
  try {
    // 1. Get user info before deleting (to send rejection email)
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) return { success: false, message: "User not found" };

    // 2. Trigger Workflow with 'REJECTED' status
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email: user[0].email,
        fullName: user[0].fullName,
        status: "REJECTED",
      },
    });

    // 3. Physically delete the user so they don't stay in the database
    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");
    return { success: true };
  } catch (error) {
    console.error("Rejection Error:", error);
    return { success: false };
  }
};
// Add this to the bottom of lib/admin/actions/User.ts

export const deleteUser = async (userId: string) => {
  try {
    // Physically remove the user from the database
    await db.delete(users).where(eq(users.id, userId));

    // Refresh the "All Users" page and the "Requests" page
    revalidatePath("/admin/users");
    revalidatePath("/admin/account-requests");

    return { success: true };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { success: false, message: "Failed to delete user" };
  }
};
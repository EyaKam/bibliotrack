"use server";

import { db } from "@/database/drizzle";
import { users, borrowRecords, books } from "@/database/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { workflowClient } from "@/lib/workflow"; // Import your workflow client
import config from "@/lib/config";

// --- NEW: APPROVE USER FUNCTION ---
export const approveUser = async (userId: string) => {
  try {
    const result = await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId))
      .returning();

    const updatedUser = result[0];

    // Trigger the email workflow
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
      },
    });

    revalidatePath("/admin/account-requests");
    revalidatePath("/admin/users");

    return { success: true, message: "User approved and notified via email." };
  } catch (error) {
    console.error("Approve User Error:", error);
    return { success: false, message: "Failed to approve user." };
  }
};

// --- NEW: REJECT USER FUNCTION ---
export const rejectUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    revalidatePath("/admin/account-requests");
    
    return { success: true, message: "User request rejected." };
  } catch (error) {
    console.error("Reject User Error:", error);
    return { success: false, message: "Failed to reject user." };
  }
};

// --- YOUR EXISTING DELETE FUNCTION ---
export const deleteUser = async (userId: string) => {
  try {
    const activeBorrows = await db
      .select({ bookId: borrowRecords.bookId })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          ne(borrowRecords.status, "RETURNED")
        )
      );

    if (activeBorrows.length > 0) {
      for (const borrow of activeBorrows) {
        await db
          .update(books)
          .set({
            availableCopies: sql`${books.availableCopies} + 1`,
          })
          .where(eq(books.id, borrow.bookId));
      }
    }

    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/admin/users");
    revalidatePath("/admin/borrow-records");
    revalidatePath("/admin"); 

    return {
      success: true,
      message: "User deleted and book stock restored successfully",
    };
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return {
      success: false,
      message: "An error occurred while deleting the user.",
    };
  }
};
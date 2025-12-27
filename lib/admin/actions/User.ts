"use server";

import { db } from "@/database/drizzle";
import { users, borrowRecords, books } from "@/database/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteUser = async (userId: string) => {
  try {
    // 1. Find all books currently borrowed by this user that haven't been returned
    const activeBorrows = await db
      .select({ bookId: borrowRecords.bookId })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          ne(borrowRecords.status, "RETURNED")
        )
      );

    // 2. Increment stock for each of those books
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

    // 3. Delete the user 
    // (This will also delete their borrowRecords because of the 'cascade' we set in the schema)
    await db.delete(users).where(eq(users.id, userId));

    // 4. Refresh all relevant data
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
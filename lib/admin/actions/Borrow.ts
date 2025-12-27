"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type BorrowStatus = "BORROWED" | "RETURNED" | "OVERDUE";

export const createBorrowRecord = async (params: {
  userId: string;
  bookId: string;
  dueDate: string;
  status: BorrowStatus;
}) => {
  try {
    // AUTOMATIC LOGIC: Check if the book is already overdue based on the date
    let finalStatus = params.status;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    const selectedDueDate = new Date(params.dueDate);

    // If it's not marked as returned but the date is in the past, it's OVERDUE
    if (finalStatus !== "RETURNED" && selectedDueDate < today) {
      finalStatus = "OVERDUE";
    }

    const newRecord = await db
      .insert(borrowRecords)
      .values({
        ...params,
        status: finalStatus,
        // Drizzle often needs a Date object for 'date' or 'timestamp' columns
        dueDate: selectedDueDate.toISOString(), 
      })
      .returning();

    revalidatePath("/admin/borrow-records");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newRecord[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while creating the borrow record",
    };
  }
};

// ... keep updateBorrowRecord and deleteBorrowRecord as they were

export const updateBorrowRecord = async (
  id: string,
  params: Partial<{
    status: BorrowStatus;
    dueDate: string;
    returnDate: string;
  }>
) => {
  try {
    // 1. Update the borrow record first
    const updatedRecord = await db
      .update(borrowRecords)
      .set(params as any)
      .where(eq(borrowRecords.id, id))
      .returning();

    if (updatedRecord.length === 0) {
      return { success: false, message: "Borrow record not found" };
    }

    const record = updatedRecord[0];

    // 2. If the status was changed to RETURNED, increment the book copies
    if (params.status === "RETURNED") {
      const bookUpdate = await db
        .update(books)
        .set({
          availableCopies: sql`${books.availableCopies} + 1`,
        })
        .where(eq(books.id, record.bookId))
        .returning();

      if (bookUpdate.length === 0) {
        return { 
          success: false, 
          message: "Record updated, but failed to find linked book for inventory." 
        };
      }
    }

    // 3. Clear the cache for the relevant pages
    revalidatePath("/admin/borrow-records");
    revalidatePath("/my-profile");
    revalidatePath("/admin"); // ✅ This refreshes your Dashboard StatCards

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.error("Update Error:", error);
    return {
      success: false,
      message: "An error occurred while updating the record",
    };
  }
};

// ... deleteBorrowRecord remains the same

export const deleteBorrowRecord = async (id: string) => {
  try {
    await db.delete(borrowRecords).where(eq(borrowRecords.id, id));

    revalidatePath("/admin/borrow-records");

    return {
      success: true,
      message: "Borrow record deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while deleting the borrow record",
    };
  }
};
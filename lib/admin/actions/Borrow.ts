"use server";

import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createBorrowRecord = async (params: {
  userId: string;
  bookId: string;
  dueDate: string;
  status: "BORROWED" | "RETURNED";
}) => {
  try {
    const newRecord = await db
      .insert(borrowRecords)
      .values(params)
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

export const updateBorrowRecord = async (
  id: string,
  params: Partial<{
    status: "BORROWED" | "RETURNED";
    dueDate: string;
    returnDate: string;
  }>
) => {
  try {
    const updatedRecord = await db
      .update(borrowRecords)
      .set(params as any)
      .where(eq(borrowRecords.id, id))
      .returning();

    revalidatePath("/admin/borrow-records");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedRecord[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating the borrow record",
    };
  }
};

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
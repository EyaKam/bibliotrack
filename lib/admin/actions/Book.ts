"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    revalidatePath("/admin/Books");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (id: string, params: BookParams) => {
  try {
    const updatedBook = await db
      .update(books)
      .set(params)
      .where(eq(books.id, id))
      .returning();

    revalidatePath("/admin/Books");
    revalidatePath(`/admin/Books/${id}`);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const deleteBook = async (id: string) => {
  try {
    await db.delete(books).where(eq(books.id, id));

    revalidatePath("/admin/Books");

    return {
      success: true,
      message: "Book deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};

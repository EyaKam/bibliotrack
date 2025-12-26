"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        title: params.title,
        author: params.author,
        genre: params.genre,
        rating: params.rating,
        coverUrl: params.coverUrl,
        coverColor: params.coverColor,
        description: params.description,
        totalCopies: params.totalCopies,
        availableCopies: params.availableCopies,
        videoUrl: params.videoUrl,
        summary: params.summary,
      })
      .returning();

    return { success: true, data: newBook[0] };
  } catch (error) {
    console.error("Error creating book:", error);
    return { success: false, message: "Failed to create book" };
  }
};

export const updateBook = async (bookId: string, params: BookParams) => {
  try {
    const updatedBook = await db
      .update(books)
      .set({
        title: params.title,
        author: params.author,
        genre: params.genre,
        rating: params.rating,
        coverUrl: params.coverUrl,
        coverColor: params.coverColor,
        description: params.description,
        totalCopies: params.totalCopies,
        availableCopies: params.availableCopies,
        videoUrl: params.videoUrl,
        summary: params.summary,
      })
      .where(eq(books.id, bookId))
      .returning();

    if (!updatedBook || updatedBook.length === 0) {
      return { success: false, message: "Book not found" };
    }

    return { success: true, data: updatedBook[0] };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, message: "Failed to update book" };
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    // Check if book has any borrow records
    const borrowedRecords = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.bookId, bookId))
      .limit(1);

    if (borrowedRecords.length > 0) {
      return {
        success: false,
        message: "Cannot delete book with existing borrow records",
      };
    }

    await db.delete(books).where(eq(books.id, bookId));

    return { success: true, message: "Book deleted successfully" };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, message: "Failed to delete book" };
  }
};

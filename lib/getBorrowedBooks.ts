// /lib/getBorrowedBooks.ts
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function getBorrowedBooks(userId: string) {
  const results = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      description: books.description,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      summary: books.summary,
      videoUrl: books.videoUrl,
      createdAt: books.createdAt, // ✅ Add this line

    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED")
      )
    );

  return results;
}

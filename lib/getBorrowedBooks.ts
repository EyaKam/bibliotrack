// /lib/getBorrowedBooks.ts
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq, and, ne } from "drizzle-orm"; // Import ne

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
      createdAt: books.createdAt,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        // ✅ Change: Show everything except RETURNED
        // This ensures OVERDUE books still show up so the user knows they need to return them!
        ne(borrowRecords.status, "RETURNED") 
      )
    );

  return results;
}
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";
import BookCover from "@/components/BookCover";

export default async function RecentlyAddedBooks() {
  const recentBooks = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(5);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recently Added Books</h3>
        <Link
          href="/admin/Books"
          className="text-sm text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Add new book */}
      <Link
        href="/admin/Books/new"
        className="mb-4 flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-gray-600 hover:bg-gray-50"
      >
        <Plus size={16} />
        Add New Book
      </Link>

      {/* Book list */}
      <div className="space-y-4">
        {recentBooks.map((book) => (
          <div key={book.id} className="flex gap-3">
            {/* Cover */}
            <Link href={`/admin/Books/${book.id}`}>
              <BookCover
                coverImage={book.coverUrl || "/images/placeholder-book.png"}
                coverColor={book.coverColor || "#E5E7EB"}
                className="h-14 w-10 rounded-md"
              />
            </Link>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-tight">
                {book.title}
              </p>
              <p className="text-xs text-gray-500">
                By {book.author} • {book.genre}
              </p>
              <p className="text-xs text-gray-400">
                {book.createdAt
                  ? new Date(book.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

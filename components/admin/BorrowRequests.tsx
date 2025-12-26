import { db } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Eye } from "lucide-react";
import BookCover from "@/components/BookCover";
import Link from "next/link";

export default async function BorrowRequests() {
  const requests = await db
    .select({
      id: borrowRecords.id,
      bookId: books.id,
      userName: users.fullName,
      bookTitle: books.title,
      coverUrl: books.coverUrl,
    })
    .from(borrowRecords)
    .leftJoin(users, eq(borrowRecords.userId, users.id))
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .limit(3);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Borrow Requests</h3>
        <Link
          href="/admin/borrow-records" 
          className="text-sm text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Book Cover */}
              <Link href={`/admin/Books/${req.bookId}`}>
                <BookCover
                  coverImage={req.coverUrl ?? ""}
                  coverColor="#E5E7EB"
                  className="h-12 w-9 rounded-md cursor-pointer"
                />
              </Link>

              {/* Text */}
              <div>
                <p className="text-sm font-medium leading-tight">
                  {req.bookTitle}
                </p>
                <p className="text-xs text-gray-500">
                  {req.userName}
                </p>
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/admin/Books/${req.bookId}`}
              className="text-gray-400 hover:text-gray-600"
            >
              <Eye size={18} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

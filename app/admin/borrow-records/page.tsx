import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import BorrowRecordsTable from "@/components/admin/BorrowTable";
import { ArrowUpDown } from "lucide-react";

const Page = async () => {
  // Fetch borrow records and join with books/users tables to get details
  const allRecordsRaw = await db
    .select({
      id: borrowRecords.id,
      status: borrowRecords.status,
      createdAt: borrowRecords.createdAt,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      bookId: borrowRecords.bookId, // Added bookId so we can link to the book page
      // Book details
      title: books.title,
      author: books.author,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      // User details
      borrowerName: users.fullName,
      borrowerEmail: users.email,
    })
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .leftJoin(users, eq(borrowRecords.userId, users.id))
    .orderBy(desc(borrowRecords.createdAt), desc(borrowRecords.id))
    .limit(100);

  // Sanitize data
  const formattedRecords = allRecordsRaw.map((record) => ({
    ...record,
    title: record.title || "Unknown Book",
    author: record.author || "Unknown Author",
    coverUrl: record.coverUrl || "",
    coverColor: record.coverColor || "#cccccc",
    borrowerName: record.borrowerName || "Unknown User",
    borrowerEmail: record.borrowerEmail || "N/A",
  }));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-dark-400">Borrow Records</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-light-400 text-dark-200 hover:bg-light-300"
          >
            <ArrowUpDown size={16} />
            <span className="max-sm:hidden">Sort</span>
          </Button>
          <Button
            className="bg-primary-admin hover:bg-primary-admin/90 text-white"
            asChild
          >
            <Link href="/admin/borrow-records/new">
              <span className="max-sm:hidden">+ Create New Record</span>
              <span className="sm:hidden">+ New</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <BorrowRecordsTable records={formattedRecords} />
      </div>
    </section>
  );
};

export default Page;

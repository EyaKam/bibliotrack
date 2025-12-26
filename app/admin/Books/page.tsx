import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import BookTable from "@/components/admin/BookTable";
import { ArrowUpDown } from "lucide-react";

const Page = async () => {
  // Fetch all books safely
  const allBooksRaw = await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt), desc(books.id)) // deterministic ordering
    .limit(100); // ensure all rows are fetched

  // Debug: check that all books are fetched
  console.log(
    "All books fetched:",
    allBooksRaw.map((b) => ({
      id: b.id,
      title: b.title,
      createdAt: b.createdAt,
    }))
  );

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-dark-400">All Books</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-light-400 text-dark-200 hover:bg-light-300"
          >
            <ArrowUpDown size={16} />
            <span className="max-sm:hidden">A-Z</span>
          </Button>
          <Button
            className="bg-primary-admin hover:bg-primary-admin/90 text-white"
            asChild
          >
            <Link href="/admin/Books/new">
              <span className="max-sm:hidden">+ Create a New Book</span>
              <span className="sm:hidden">+ New</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        {/* Pass raw results, no early casting */}
        <BookTable books={allBooksRaw} />
      </div>
    </section>
  );
};

export default Page;

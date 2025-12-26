import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, asc, sql } from "drizzle-orm";
import BookTable from "@/components/admin/BookTable";
import SortButton from "@/components/admin/SortButton";
import SearchBar from "@/components/admin/SearchBar";

interface PageProps {
  searchParams: Promise<{
    sort?: string;
    search?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const sortType = params.sort ?? "newest";
  const searchQuery = params.search ?? "";

  // ✅ IMPORTANT: $dynamic()
  let query = db.select().from(books).$dynamic();

  // Search
  if (searchQuery) {
    const q = `%${searchQuery.toLowerCase()}%`;
    query = query.where(
      sql`
        LOWER(${books.title}) LIKE ${q}
        OR LOWER(${books.author}) LIKE ${q}
        OR LOWER(${books.genre}) LIKE ${q}
      `
    );
  }

  // Sorting
  switch (sortType) {
    case "oldest":
      query = query.orderBy(asc(books.createdAt), asc(books.id));
      break;
    case "available":
      query = query.orderBy(desc(books.availableCopies), desc(books.id));
      break;
    case "highestRated":
      query = query.orderBy(desc(books.rating), desc(books.id));
      break;
    case "newest":
    default:
      query = query.orderBy(desc(books.createdAt), desc(books.id));
  }

  const allBooksRaw = await query.limit(100);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-dark-400">All Books</h2>

        <div className="flex items-center gap-3">
          <SortButton currentSort={sortType} />
          <Button
            asChild
            className="bg-primary-admin text-white hover:bg-primary-admin/90"
          >
            <Link href="/admin/Books/new">
              <span className="max-sm:hidden">+ Create a New Book</span>
              <span className="sm:hidden">+ New</span>
            </Link>
          </Button>
        </div>
      </div>

      <SearchBar initialSearch={searchQuery} />

      <div className="mt-7 w-full overflow-hidden">
        <BookTable books={allBooksRaw} />
      </div>
    </section>
  );
};

export default Page;

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { desc } from "drizzle-orm";
import BorrowForm from "@/components/admin/forms/BorrowForm";

const Page = async () => {
  // Fetch users and books for the selection dropdowns
  const [allUsers, allBooks] = await Promise.all([
    db
      .select({ id: users.id, fullName: users.fullName, email: users.email })
      .from(users)
      .limit(100), // Limit for performance, consider search for larger sets
    db
      .select({ id: books.id, title: books.title })
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(100),
  ]);

  return (
    <>
      <Button asChild variant="ghost" className="mb-7">
        <Link href="/admin/borrow-records">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Borrow Records
        </Link>
      </Button>

      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-dark-400">
            Create New Borrow Record
          </h2>
        </div>

        <div className="mt-7 w-full">
          <BorrowForm users={allUsers} books={allBooks} />
        </div>
      </section>
    </>
  );
};

export default Page;

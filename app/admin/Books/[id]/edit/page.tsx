import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditBookForm from "@/components/admin/forms/EditBookForm";
import { ArrowLeft } from "lucide-react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/admin/Books");

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/Books" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Go back
        </Link>
      </Button>

      <section className="w-full max-w-3xl">
        <EditBookForm book={bookDetails} />
      </section>
    </>
  );
};

export default Page;

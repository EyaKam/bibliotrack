import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import BookCover from "@/components/BookCover";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // Fetch book details
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/admin/Books");

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/Books" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Go back
        </Link>
      </Button>

      <div className="flex flex-col gap-7 lg:flex-row">
        {/* Book Cover Section */}
        {bookDetails.coverUrl && (
          <div className="flex-shrink-0">
            <BookCover
              variant="wide" // or "Small" if you prefer
              coverColor={bookDetails.coverColor}
              coverImage={bookDetails.coverUrl}
              className="h-[400px] w-[280px] rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Book Information Section */}
        <div className="flex-1 rounded-2xl bg-white p-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="mb-2 text-sm text-light-500">
                Created at: {formatDate(bookDetails.createdAt)}
              </p>
              <h1 className="mb-2 text-3xl font-bold text-dark-400">
                {bookDetails.title}
              </h1>
              <p className="mb-3 text-xl text-dark-200">
                By {bookDetails.author}
              </p>
              <div className="inline-block rounded-full bg-light-300 px-4 py-1.5 text-sm font-medium text-dark-200">
                {bookDetails.genre}
              </div>
            </div>
          </div>

          <Button className="book-form_btn mt-6" asChild>
            <Link
              href={`/admin/Books/${id}/edit`}
              className="flex items-center justify-center gap-2"
            >
              <Pencil size={16} />
              Edit Book
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Section */}
      <section className="mt-7 rounded-2xl bg-white p-7">
        <h3 className="mb-4 text-xl font-semibold text-dark-400">Summary</h3>
        <div className="space-y-4 text-dark-200 leading-relaxed">
          {bookDetails.summary.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </section>

      {/* Video Section - only if videoUrl exists */}
      {bookDetails.videoUrl && bookDetails.videoUrl.trim() !== "" && (
        <section className="mt-7 rounded-2xl bg-white p-7">
          <h3 className="mb-4 text-xl font-semibold text-dark-400">Video</h3>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-light-300">
            <video
              src={bookDetails.videoUrl}
              controls
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Additional Details */}
      <section className="mt-7 rounded-2xl bg-white p-7">
        <h3 className="mb-6 text-xl font-semibold text-dark-400">
          Book Details
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-light-300 p-4">
            <p className="text-sm font-medium text-light-500 mb-2">Rating</p>
            <p className="text-2xl font-semibold text-dark-400">
              {bookDetails.rating}/5
            </p>
          </div>
          <div className="rounded-lg bg-light-300 p-4">
            <p className="text-sm font-medium text-light-500 mb-2">
              Total Copies
            </p>
            <p className="text-2xl font-semibold text-dark-400">
              {bookDetails.totalCopies}
            </p>
          </div>
          <div className="rounded-lg bg-light-300 p-4">
            <p className="text-sm font-medium text-light-500 mb-2">
              Available Copies
            </p>
            <p className="text-2xl font-semibold text-dark-400">
              {bookDetails.availableCopies}
            </p>
          </div>
          <div className="rounded-lg bg-light-300 p-4">
            <p className="text-sm font-medium text-light-500 mb-2">Genre</p>
            <p className="text-2xl font-semibold text-dark-400">
              {bookDetails.genre}
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="mt-7 rounded-2xl bg-white p-7">
        <h3 className="mb-4 text-xl font-semibold text-dark-400">
          Description
        </h3>
        <p className="text-dark-200 leading-relaxed">
          {bookDetails.description}
        </p>
      </section>
    </>
  );
};

export default Page;

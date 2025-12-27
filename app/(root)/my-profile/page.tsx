import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import ProfileCard from "@/components/Profilecard";
import BookList from "@/components/BookList";
import { getBorrowedBooks } from "@/lib/getBorrowedBooks";
import Link from "next/link"; // Added for navigation

export default async function Page() {
  const session = await auth();

  if (!session?.user?.email) {
    return <p className="text-center mt-10">You must be logged in</p>;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1)
    .then(res => res[0]);

  if (!user) {
    return <p className="text-center mt-10">User not found</p>;
  }

  const borrowedBooks = await getBorrowedBooks(user.id);

  return (
    <section className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl flex flex-col items-center gap-12">
        
        {/* PROFILE CARD */}
        <div className="w-full flex justify-center">
          <ProfileCard
            user={{
              fullName: user.fullName,
              email: user.email,
              universityId: user.universityId,
              universityCard: user.universityCard,
              isVerified: user.status === "APPROVED",
            }}
          />
        </div>

        {/* BOOK LIST */}
        <div className="w-full">
          {borrowedBooks.length > 0 ? (
            <BookList title="Borrowed Books" books={borrowedBooks} />
          ) : (
            <div className="flex flex-col items-center gap-3 mt-10">
              <p className="text-dark-400 text-lg">You don't have any active borrows.</p>
              <Link href="/" className="text-primary font-semibold hover:underline">
                Explore the Library →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
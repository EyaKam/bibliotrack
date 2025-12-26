import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import ProfileCard from "@/components/Profilecard";
import BookList from "@/components/BookList";
import { getBorrowedBooks } from "@/lib/getBorrowedBooks";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.email) {
    return <p>You must be logged in</p>;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1)
    .then(res => res[0]);

  if (!user) {
    return <p>User not found</p>;
  }

  const borrowedBooks = await getBorrowedBooks(user.id);

  return (
    <section className="px-8 py-10 space-y-10">
      <ProfileCard
        user={{
          fullName: user.fullName,
          email: user.email,
          universityId: user.universityId,
          universityCard: user.universityCard,
          isVerified: user.status === "APPROVED",
        }}
      />

      <BookList title="Borrowed Books" books={borrowedBooks} />
    </section>
  );
}

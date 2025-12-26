import { auth } from "@/auth";
import BookList from "@/components/BookList";
import { getBorrowedBooks } from "@/lib/getBorrowedBooks";

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return <p>You must be logged in</p>;
  }

  const borrowedBooks = await getBorrowedBooks(session.user.id);

  return (
    /* Added pt-40 to create a significant gap below the header */
    /* Added min-h-screen to ensure the dark background covers the whole page */
    <section className="px-8 pt-40 pb-20 min-h-screen">
      {borrowedBooks.length > 0 ? (
        <BookList title="Borrowed Books" books={borrowedBooks} />
      ) : (
        /* Matches the text-gray-500 from your screenshot */
        <p className="text-center text-gray-500 text-lg">
          No borrowed books yet.
        </p>
      )}
    </section>
  );
};

export default Page;

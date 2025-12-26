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
    <section className="px-8 py-6">
      {borrowedBooks.length > 0 ? (
        <BookList title="Borrowed Books" books={borrowedBooks} />
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No borrowed books yet.
        </p>
      )}
    </section>
  );
};

export default Page;

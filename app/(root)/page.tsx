import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

const Home = async () => {
  const session = await auth();
  
  const latestBooks = (await db 
      .select()
      .from(books)
      .limit(10)
      .orderBy(desc(books.createdAt)) ) as Book[];

  return (
    <div className="flex flex-col pt-40 pb-20">
      {/* This wrapper with pt-40 ensures that the BookOverview starts 
        below your absolute-positioned header.
      */}
      
      <BookOverview 
        {...latestBooks[0]} 
        userId={session?.user?.id as string} 
      />

      <BookList
        title="Latest books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </div>
  );
};

export default Home;
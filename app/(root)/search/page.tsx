import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/auth";
import BookList from "@/components/BookList";
import { like } from "drizzle-orm";

interface SearchPageProps {
  searchParams: Promise<{ query?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const session = await auth();
  const { query } = await searchParams;

  let searchResults = [];
  
  if (query) {
    searchResults = await db
      .select()
      .from(books)
      .where(like(books.title, `%${query}%`));
  } else {
    searchResults = await db.select().from(books);
  }

  return (
    <div>
      <main className="container mx-auto px-8 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">
            Discover your next great read:
          </p>
          <h1 className="text-5xl font-bold text-white mb-8">
            Explore and Search for<br />
            Any Book In Our Library
          </h1>
          
          {/* Search Bar */}
          <form action="/search" method="GET" className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="Search for books by title..."
                className="w-full px-6 py-4 bg-[#1a1d29] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-amber-100 placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                🔍
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              
            </h2>
            
            <select className="px-4 py-2 bg-[#1a1d29] text-white rounded-lg border border-gray-700 focus:outline-none">
              <option>Filter by: Department</option>
              <option>Computer Science</option>
            </select>
          </div>

          {query && (
            <p className="text-gray-400 mb-6">
              Found {searchResults.length} results for "{query}"
            </p>
          )}

          

          <BookList title="Search Results" books={searchResults} />
        </section>
      </main>
    </div>
  );
};

export default SearchPage;
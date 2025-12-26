import StatCard from "@/components/admin/StatCard";
import BorrowRequests from "@/components/admin/BorrowRequests";
import AccountRequests from "@/components/admin/accountrequests";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { sql } from "drizzle-orm";
import RecentlyAddedBooks from "@/components/admin/RecentlyAddedBooks";

export default async function AdminDashboard() {
  const [{ count: totalUsers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [{ count: totalBooks }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(books);

  const [{ count: borrowedBooks }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(borrowRecords);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Borrowed Books" value={borrowedBooks.toString()} />
        <StatCard title="Total Users" value={totalUsers.toString()} />
        <StatCard title="Total Books" value={totalBooks.toString()} />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <BorrowRequests />
          <AccountRequests />
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <RecentlyAddedBooks />
        </div>

      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema"; // Import borrowRecords
import { asc, count, eq } from "drizzle-orm";
import { ArrowUpDown } from "lucide-react";
import UserTable from "@/components/admin/UserTable";

// Define the type to match Figma requirements
interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: "USER" | "ADMIN";
  status: string;
  createdAt: Date | null;
  borrowedCount: number; // Added to match Figma's "Books Borrowed" column
}

const Page = async () => {
  // Fetch users with their borrow count to match the "Books Borrowed" column
  const allUsersWithCount = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      // Aggregating borrow records per user
      borrowedCount: count(borrowRecords.id),
    })
    .from(users)
    .leftJoin(borrowRecords, eq(users.id, borrowRecords.userId))
    .groupBy(users.id)
    .orderBy(asc(users.fullName));

  // Cast to our defined User type
  const filteredUsers = allUsersWithCount as User[];

  return (
    <div className="flex flex-col gap-5">
      {/* Header section with specific Figma styling */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-7 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">All Users</h2>

        <Button
          variant="outline"
          className="gap-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-xs px-4"
        >
          <span className="font-bold">A–Z</span>
          <ArrowUpDown size={14} className="text-slate-400" />
        </Button>
      </section>

      {/* Table container */}
      <section className="w-full rounded-2xl bg-white p-5 shadow-sm border border-slate-100 overflow-hidden">
        <UserTable users={filteredUsers} />
      </section>
    </div>
  );
};

export default Page;
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import AccountRequestsTable from "../../app/admin/account-requests/AccountRequestsTable";

export default async function AccountRequests() {
  const requests = await db
    .select({
      id: users.id,
      fullName: users.fullName, // Changed from 'name' to 'fullName' to match schema
      email: users.email,
      universityId: users.universityId,   // ADDED
      universityCard: users.universityCard, // ADDED
      status: users.status,               // ADDED
    })
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt))
    .limit(6);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-slate-800">Recent Account Requests</h3>
        <Link
          href="/admin/account-requests" 
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* This now passes the CORRECT data structure to the table */}
      <AccountRequestsTable users={requests as any} />
    </div>
  );
}
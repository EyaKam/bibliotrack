import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import AccountRequestsTable from "./AccountRequestsTable";

const Page = async () => {
  // 1. Fetch only users with PENDING status
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt));

  return (
    <section className="w-full rounded-2xl bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Requests</h2>
          <p className="text-sm text-slate-500 mt-1">Review and approve student registrations</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold border border-amber-100">
          {pendingUsers.length} Requests Pending
        </div>
      </div>

      {/* 2. Pass data to the Client Table Component */}
      <AccountRequestsTable users={pendingUsers} />
    </section>
  );
};

export default Page;
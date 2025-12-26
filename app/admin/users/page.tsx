import React from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { asc } from "drizzle-orm";
import { ArrowUpDown } from "lucide-react";
import UserTable from "@/components/admin/UserTable";

const Page = async () => {
  const allUsersRaw = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.fullName));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-dark-400">All Users</h2>

        <Button
          variant="outline"
          className="gap-2 border-light-400 text-dark-200 hover:bg-light-300"
        >
          <ArrowUpDown size={16} />
          <span className="max-sm:hidden">A–Z</span>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <UserTable users={allUsersRaw} />
      </div>
    </section>
  );
};

export default Page;

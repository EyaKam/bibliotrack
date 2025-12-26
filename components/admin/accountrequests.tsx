import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/dist/client/link";

export default async function AccountRequests() {
  const requests = await db
    .select({
      id: users.id,
      name: users.fullName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.status, "PENDING"))
    .limit(6);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Account Requests</h3>
       <Link
          href="/admin/account-requests" 
          className="text-sm text-blue-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {requests.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center text-center gap-2"
          >
            {/* Avatar (initiales) */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                {getInitials(user.name)}
              </span>
            </div>

            {/* Infos */}
            <div>
              <p className="text-sm font-medium leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[110px]">
                {user.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Utilitaire */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

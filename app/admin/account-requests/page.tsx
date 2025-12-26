import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountRequestsTable from "./AccountRequestsTable";

const AccountRequestsPage = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  // Fetch pending users
  const pendingUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.status, "PENDING"));

  // Convert Date to string for serialization
  const serializedUsers = pendingUsers.map((user) => ({
    ...user,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
  }));

  return <AccountRequestsTable users={serializedUsers} />;
};

export default AccountRequestsPage;

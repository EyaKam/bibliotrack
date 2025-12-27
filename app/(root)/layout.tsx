import { ReactNode } from "react";
import Header from "@/components/Header";
import { auth, signOut } from "@/auth"; // Added signOut import
import { redirect } from "next/navigation";
import { after } from "next/server";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session || !session.user?.id) redirect("/sign-in");

  // 1. Fetch user from DB
  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const currentUser = userResults[0];

  // 2. Check if user is APPROVED
  // If status is PENDING or REJECTED, they see this screen
  if (!currentUser || (currentUser.status as string) !== "APPROVED") {
    return (
      <main className="root-container flex min-h-screen items-center justify-center px-5">
        <div className="flex flex-col items-center bg-dark-100 p-10 rounded-2xl border border-light-400 text-center max-w-md shadow-lg">
          <div className="mb-6 rounded-full bg-amber-400/10 p-4">
            <span className="text-4xl">⏳</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Account Pending Approval
          </h1>
          
          <p className="text-light-100 mb-6">
            Hi <span className="text-amber-400 font-semibold">{currentUser?.fullName || "Student"}</span>, 
            your account status is currently <span className="underline italic text-amber-400">{currentUser?.status?.toLowerCase() || "pending"}</span>.
          </p>

          <div className="bg-dark-200 p-4 rounded-lg text-sm text-light-200">
            <p>Our library admins are currently verifying your University ID card.</p>
            <p className="mt-2">You will receive an email notification as soon as your access is granted.</p>
          </div>
          
          {/* 3. Proper Sign Out Button using a Server Action */}
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mt-10"
          >
            <button 
              type="submit" 
              className="text-sm font-semibold text-light-100 hover:text-white transition-colors underline underline-offset-4"
            >
              Sign out and check later
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 4. Update activity (only for approved users)
  after(async () => {
    if (!session.user?.id) return;

    const today = new Date().toISOString().slice(0, 10);
    if (currentUser.lastactivitydate === today) return;

    await db
      .update(users)
      .set({ lastactivitydate: today })
      .where(eq(users.id, session.user.id));
  });

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header userName={currentUser.fullName} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
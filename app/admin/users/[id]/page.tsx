import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  // 1. Await params for Next.js 15 compatibility
  const { id } = await params;

  // 2. Fetch user data
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) return notFound();

  // 3. Fix the Double Slash in the URL
  const imageKitEndpoint = "https://ik.imagekit.io/bibliotrackproject"; 
  
  // This logic ensures we don't get // in the middle of the URL
  const cleanPath = user.universityCard.startsWith("/") 
    ? user.universityCard 
    : `/${user.universityCard}`;
    
  const fullImageUrl = `${imageKitEndpoint}${cleanPath}`;

  return (
    <section className="w-full rounded-2xl bg-white p-7 shadow-sm border border-slate-100">
      <div className="mb-8 flex flex-col gap-2">
        <Link href="/admin/users" className="text-blue-600 text-sm font-semibold hover:underline">
          ← Back to All Users
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">
          Student Card: {user.fullName}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Card Display Area */}
        <div className="relative aspect-[3/2] w-full max-w-2xl overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 shadow-inner">
          {user.universityCard ? (
            <img
              src={fullImageUrl}
              alt="University ID Card"
              className="h-full w-full object-contain p-4"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No ID card image uploaded.
            </div>
          )}
        </div>

        {/* RE-ADDED: User Details section */}
        <div className="grid w-full max-w-2xl grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">University ID</p>
            <p className="text-lg font-semibold text-slate-700">{user.universityId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email Address</p>
            <p className="text-lg font-semibold text-slate-700">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Account Status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              user.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}>
              {user.status}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">User Role</p>
            <p className="text-lg font-semibold text-slate-700 uppercase">{user.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
import Image from "next/image";

type ProfileCardProps = {
  user: {
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string; // path depuis ImageKit
    isVerified: boolean;
    image?: string;
  };
};

export default function ProfileCard({ user }: ProfileCardProps) {
  const imageUrl = user.universityCard
    ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${user.universityCard}`
    : "/card-placeholder.png";

  return (
    <div className="relative max-w-md rounded-2xl bg-gradient-to-br from-[#1b1f2a] to-[#0e111a] p-6 shadow-xl text-white">
      {/* TOP CLIP */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="relative w-16 h-10 bg-slate-600 rounded-b-2xl shadow-md">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-800 rounded-full" />
          </div>
        </div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-700">
          {user.image ? (
            <Image
              src={user.image}
              alt="User avatar"
              fill
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-bold">
              {user.fullName?.[0] ?? "U"}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                user.isVerified ? "bg-green-400" : "bg-yellow-400"
              }`}
            />
            <span className="text-gray-300">
              {user.isVerified ? "Verified Student" : "Pending Approval"}
            </span>
          </div>

          <h2 className="text-xl font-semibold">{user.fullName}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Student ID */}
      <div className="mt-6 space-y-3 text-sm">
        <div>
          <p className="text-gray-400">Student ID</p>
          <p className="font-medium tracking-widest">
            {user.universityId}
          </p>
        </div>
      </div>

      {/* UNIVERSITY CARD */}
<div className="mt-6 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600">
  
  {/* IMAGE */}
  <div className="relative w-full aspect-[16/9]">
    <Image
      src={
        user.universityCard
          ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${user.universityCard}`
          : "/card-placeholder.png"
      }
      alt="University Card"
      fill
      className="object-cover"
      priority
    />
  </div>

  {/* TEXT */}
  <div className="p-4">
    <p className="font-semibold text-white">University Card</p>
    <p className="text-sm text-white/80">
      Verified academic identity
    </p>
  </div>
</div>

    </div>
  );
}

import Image from "next/image";

type ProfileCardProps = {
  user: {
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    isVerified: boolean;
  };
};

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="relative max-w-md rounded-2xl bg-gradient-to-br from-[#1b1f2a] to-[#0e111a] p-6 shadow-xl text-white">

      {/* Clip */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-16 rounded-b-xl bg-slate-600 opacity-60" />

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">
          {user.fullName?.charAt(0) ?? "U"}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            {user.isVerified ? "Verified Student" : "Pending Approval"}
          </div>

          <h2 className="text-xl font-semibold">{user.fullName}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 space-y-3 text-sm">
        <div>
          <p className="text-gray-400">University</p>
          <p className="font-medium">JS Mastery Pro</p>
        </div>

        <div>
          <p className="text-gray-400">Student ID</p>
          <p className="font-medium tracking-widest">{user.universityId}</p>
        </div>
      </div>

      {/* Card */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center gap-4">
        <div className="h-14 w-14 rounded-lg bg-black/30 flex items-center justify-center">
          🎓
        </div>

        <div className="flex-1">
          <p className="font-semibold">JS Mastery University</p>
          <p className="text-xs opacity-80">
            Empowering Dreams, Inspiring Futures
          </p>
        </div>
      </div>
    </div>
  );
}

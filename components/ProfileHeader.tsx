import Image from "next/image";

type ProfileHeaderProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-5 mb-8">
      {/* Avatar */}
      <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-semibold text-white">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        ) : (
          user.name?.[0]
        )}
      </div>

      {/* Info */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          {user.name}
        </h2>
        <p className="text-sm text-gray-400">{user.email}</p>

        <p className="mt-1 text-sm text-gray-500">
          Member since 2024 • Active borrower
        </p>
      </div>
    </div>
  );
}

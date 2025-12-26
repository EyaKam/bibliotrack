import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut } from "lucide-react";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getFirstName = (name: string) => {
  return name.split(" ")[0];
};

interface HeaderProps {
  userName: string;
}

const Header = ({ userName }: HeaderProps) => {
  const firstName = getFirstName(userName);

  return (
    <header className="flex justify-between items-center py-6 px-8">
      {/* Logo */}
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={100} height={100} />
      </Link>

      {/* Right navigation */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-white hover:text-amber-100 transition-colors text-l font-medium"
        >
          Home
        </Link>

        <Link
          href="/search"
          className="text-white hover:text-amber-100 transition-colors text-l font-medium"
        >
          Search
        </Link>

        {/* Profile */}
        <Link
          href="/my-profile"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="w-8 h-8 bg-white">
            <AvatarFallback className="bg-white text-[#1a1d29] text-xs font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-l font-medium">
            {firstName}
          </span>
        </Link>

        {/* Logout icon */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Logout"
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;

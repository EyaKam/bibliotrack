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

// ... (keep your imports and helpers the same)

// ... (keep your imports and helpers the same)

const Header = ({ userName }: HeaderProps) => {
  const firstName = getFirstName(userName);

  return (
    /* 1. Changed 'fixed' to 'absolute': It stays at the top but scrolls with the page.
      2. 'top-0 left-0 w-full': Forces it to the edges regardless of parent centering.
      3. 'z-10': Keeps it above background elements.
    */
    <header className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex w-full max-w-7xl justify-between items-center py-10 px-8">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={70}
          height={70}
          className="block"
        />
        <span className="text-2xl text-white drop-shadow-lg font-bold">
          Bibliotrack
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-white hover:text-amber-100 transition-colors text-base font-medium"
        >
          Home
        </Link>

        <Link
          href="/search"
          className="text-white hover:text-amber-100 transition-colors text-base font-medium"
        >
          Search
        </Link>

        <Link
          href="/my-profile"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Avatar className="w-8 h-8 bg-white">
            <AvatarFallback className="bg-white text-[#1a1d29] text-xs font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-base font-medium">
            {firstName}
          </span>
        </Link>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="flex items-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-500 hover:text-orange-600 hover:bg-white/10"
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
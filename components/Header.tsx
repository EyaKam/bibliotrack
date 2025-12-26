import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName = "Adrian" }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center py-6 px-8">
      {/* Logo */}
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      {/* Navigation à droite */}
      <div className="flex items-center gap-6">
        {/* Home Link */}
        <Link 
          href="/" 
          className="text-white hover:text-amber-100 transition-colors text-sm font-medium"
        >
          Home
        </Link>

        {/* Search Link */}
        <Link 
          href="/search" 
          className="text-white hover:text-amber-100 transition-colors text-sm font-medium"
        >
          Search
        </Link>

        {/* User Profile */}
        <Link 
          href="/my-profile" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="w-8 h-8 bg-white">
            <AvatarFallback className="bg-white text-[#1a1d29] text-xs font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-sm font-medium">{userName}</span>
        </Link>

        {/* Logout Button */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button 
            className="bg-amber-100 text-[#1a1d29] hover:bg-amber-200 font-medium"
          >
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
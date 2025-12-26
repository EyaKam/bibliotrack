"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RoleDropdown from "@/components/RoleDropdown";
import { SquareArrowOutUpRight, Trash2 } from "lucide-react"; // Matching the Figma icons

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: "USER" | "ADMIN";
  status: string;
  createdAt: Date | null;
  borrowedCount: number; // Added to handle the data from the new query
};

const UserTable = ({ users }: { users: UserRow[] }) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="w-full">
      <Table className="border-none">
        <TableHeader className="bg-transparent">
          <TableRow className="border-none hover:bg-transparent">
            {/* Design uses specific sentence case and slate colors */}
            <TableHead className="text-slate-500 font-medium text-xs">Name</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">Date Joined</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">Role</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">Books Borrowed</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">University ID No</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs text-blue-600">University ID Card</TableHead>
            <TableHead className="text-right text-slate-500 font-medium text-xs">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
              {/* Avatar + Name & Email */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-sm">{user.fullName}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </div>
              </TableCell>

              {/* Date Joined */}
              <TableCell className="text-slate-600 font-medium text-sm">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
              </TableCell>

              {/* Role Dropdown */}
              <TableCell>
                <RoleDropdown userId={user.id} role={user.role} />
              </TableCell>

              {/* Books Borrowed */}
              <TableCell className="text-slate-700 font-bold text-sm text-center">
                {user.borrowedCount}
              </TableCell>

              {/* ID No */}
              <TableCell className="text-slate-600 font-medium text-sm">
                {user.universityId}
              </TableCell>

              {/* Action - Link to ID Card with Icon */}
              <TableCell>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:underline"
                >
                  View ID Card
                  <SquareArrowOutUpRight size={14} />
                </Link>
              </TableCell>

              {/* Delete Icon */}
              <TableCell className="text-right">
                <button className="text-red-400 hover:text-red-600 p-2 transition-colors">
                  <Trash2 size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
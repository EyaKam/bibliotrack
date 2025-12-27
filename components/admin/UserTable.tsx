"use client";

import React, { useState } from "react"; // Added useState
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
import { SquareArrowOutUpRight, Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "@/lib/admin/actions/User"; // Import action
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: "USER" | "ADMIN";
  status: string;
  createdAt: Date | null;
  borrowedCount: number;
};

const UserTable = ({ users }: { users: UserRow[] }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setIsDeleting(userId);
    const result = await deleteUser(userId);

    if (result.success) {
      toast.success("User deleted successfully");
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsDeleting(null);
  };

  return (
    <div className="w-full">
      <Table className="border-none">
        <TableHeader className="bg-transparent">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-slate-500 font-medium text-xs">Name</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">Date Joined</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">Role</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs text-center">Books Borrowed</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs">University ID No</TableHead>
            <TableHead className="text-slate-500 font-medium text-xs text-blue-600">University ID Card</TableHead>
            <TableHead className="text-right text-slate-500 font-medium text-xs">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
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

              <TableCell className="text-slate-600 font-medium text-sm">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
              </TableCell>

              <TableCell>
                <RoleDropdown userId={user.id} role={user.role} />
              </TableCell>

              <TableCell className="text-slate-700 font-bold text-sm text-center">
                {user.borrowedCount}
              </TableCell>

              <TableCell className="text-slate-600 font-medium text-sm">
                {user.universityId}
              </TableCell>

              <TableCell>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:underline"
                >
                  View ID Card
                  <SquareArrowOutUpRight size={14} />
                </Link>
              </TableCell>

              <TableCell className="text-right">
                <button 
                  onClick={() => handleDelete(user.id)}
                  disabled={isDeleting === user.id}
                  className="text-red-400 hover:text-red-600 p-2 transition-colors disabled:opacity-50"
                >
                  {isDeleting === user.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
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
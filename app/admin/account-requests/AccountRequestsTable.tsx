"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const AccountRequestsTable = ({ users }: { users: UserProps[] }) => {
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [actionType, setActionType] = useState<"approve" | "deny" | null>(null);

  const handleAction = async (user: UserProps, type: "approve" | "deny") => {
    setSelectedUser(user);
    setActionType(type);
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionType === "approve" ? "APPROVED" : "REJECTED",
        }),
      });

      toast.success(
        `User ${actionType === "approve" ? "approved" : "denied"} successfully`
      );
      setSelectedUser(null);
      setActionType(null);
      window.location.reload();
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Account Registration Requests</h1>
        <button className="text-sm text-gray-600 flex items-center gap-1">
          Oldest to Recent ⇅
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Date Joined</th>
              <th className="pb-3 font-medium">University ID No</th>
              <th className="pb-3 font-medium">University ID Card</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-700">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="py-4 text-gray-700">{user.universityId}</td>
                <td className="py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                    👁️ View ID Card
                  </button>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4"
                      onClick={() => handleAction(user, "approve")}
                    >
                      Approve Account
                    </Button>
                    <button
                      className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500"
                      onClick={() => handleAction(user, "deny")}
                    >
                      ⊗
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Account Request"
                : "Deny Account Request"}
            </DialogTitle>
          </DialogHeader>
          <p className="my-4">
            {actionType === "approve"
              ? "Approve the student's account request and grant access. A confirmation email will be sent upon approval."
              : "Denying this request will notify the student they're not eligible due to unsuccessful ID card verification."}
          </p>
          <DialogFooter>
            <Button
              onClick={confirmAction}
              variant={actionType === "approve" ? "default" : "destructive"}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {actionType === "approve"
                ? "Approve & Send Confirmation"
                : "Deny & Notify Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountRequestsTable;

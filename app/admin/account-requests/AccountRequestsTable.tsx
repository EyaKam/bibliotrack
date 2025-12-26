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
import { Eye, ArrowUpDown } from "lucide-react";

const AccountRequestsTable = ({ users }: { users: UserProps[] }) => {
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [actionType, setActionType] = useState<"approve" | "deny" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingCard, setViewingCard] = useState<string | null>(null);

  const handleAction = async (user: UserProps, type: "approve" | "deny") => {
    setSelectedUser(user);
    setActionType(type);
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType || isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionType === "approve" ? "APPROVED" : "REJECTED",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      toast.success(
        `User ${actionType === "approve" ? "approved" : "denied"} successfully`
      );
      setSelectedUser(null);
      setActionType(null);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewIdCard = (universityCard: string) => {
    const imageKitBaseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    const fullImageUrl = `${imageKitBaseUrl}${universityCard}`;
    setViewingCard(fullImageUrl);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-7 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-slate-900">Account Registration Requests</h1>
        <Button variant="outline" className="text-xs font-bold text-slate-600 gap-2 border-slate-200">
          Oldest to Recent <ArrowUpDown size={14} className="text-slate-400" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="pb-5 font-medium">Name</th>
              <th className="pb-5 font-medium">Date Joined</th>
              <th className="pb-5 font-medium">University ID No</th>
              <th className="pb-5 font-medium">University ID Card</th>
              <th className="pb-5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {/* UPDATED AVATAR STYLE: White circle with blue text */}
                    <div className="w-10 h-10 rounded-full bg-blue-50  flex items-center justify-center text-blue-600 font-bold text-xs ">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm font-medium text-slate-600">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="py-4 text-sm font-medium text-slate-600">{user.universityId}</td>
                <td className="py-4">
                  <button
                    onClick={() => handleViewIdCard(user.universityCard)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View ID Card
                  </button>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      className="bg-[#02b18d] hover:bg-[#029a7b] text-white text-xs font-bold px-4 py-2 h-9 rounded-lg"
                      onClick={() => handleAction(user, "approve")}
                    >
                      Approve Account
                    </Button>
                    <button
                      className="w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                      onClick={() => handleAction(user, "deny")}
                      title="Deny account"
                    >
                      <span className="text-xl leading-none">×</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals remain the same but with updated button styling */}
      <Dialog open={!!viewingCard} onOpenChange={() => setViewingCard(null)}>
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">University ID Card</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <img
              src={viewingCard || ""}
              alt="University ID Card"
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 font-bold px-8" onClick={() => setViewingCard(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedUser}
        onOpenChange={() => !isProcessing && setSelectedUser(null)}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {actionType === "approve"
                ? "Approve Account Request"
                : "Deny Account Request"}
            </DialogTitle>
          </DialogHeader>
          <p className="my-4 text-slate-500 text-sm leading-relaxed">
            {actionType === "approve"
              ? "Approve the student's account request and grant access. A confirmation email will be sent upon approval."
              : "Denying this request will notify the student they're not eligible due to unsuccessful ID card verification."}
          </p>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
              disabled={isProcessing}
              className="font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              variant={actionType === "approve" ? "default" : "destructive"}
              className={`font-bold ${
                actionType === "approve"
                  ? "bg-[#02b18d] hover:bg-[#029a7b]"
                  : ""
              }`}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve & Send"
                  : "Deny & Notify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountRequestsTable;
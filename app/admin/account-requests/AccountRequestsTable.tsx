"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Eye, Check, XCircle } from "lucide-react";
import { approveUser, rejectUser } from "@/lib/admin/actions/User";
import { toast } from "sonner";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
}

const AccountRequestsTable = ({ users = [] }: { users: User[] }) => {
  const [viewingCard, setViewingCard] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Exact endpoint from your project
  const imageKitEndpoint = "https://ik.imagekit.io/bibliotrackproject";

  const handleAction = async (id: string, type: "approve" | "reject") => {
    setIsProcessing(id);
    try {
      const res = type === "approve" ? await approveUser(id) : await rejectUser(id);
      
      if (res.success) {
        toast.success(`User ${type === "approve" ? "Approved" : "Rejected"} successfully`);
      } else {
        toast.error(`Failed to ${type} user. Check your API URL.`);
      }
    } catch (error) {
      toast.error("An error occurred during the process.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="mt-6 overflow-x-auto border border-slate-100 rounded-xl shadow-sm">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
            <th className="py-4 px-4">Student</th>
            <th className="py-4 px-4">University ID</th>
            <th className="py-4 px-4">ID Document</th>
            <th className="py-4 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-bold text-sm text-slate-900">{user.fullName}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-slate-600">
                  {user.universityId}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => setViewingCard(user.universityCard)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Eye size={16} /> View Card
                  </button>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      disabled={isProcessing === user.id}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8"
                      onClick={() => handleAction(user.id, "approve")}
                    >
                      {isProcessing === user.id ? "..." : <><Check size={14} className="mr-1"/> Approve</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isProcessing === user.id}
                      className="font-bold h-8"
                      onClick={() => handleAction(user.id, "reject")}
                    >
                      {isProcessing === user.id ? "..." : <><XCircle size={14} className="mr-1"/> Reject</>}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-12 text-center text-slate-400 font-medium italic">
                No pending account requests at this time.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- ID CARD MODAL WINDOW --- */}
      <Dialog open={!!viewingCard} onOpenChange={() => setViewingCard(null)}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">University ID Verification</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 flex justify-center bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-200">
            {viewingCard && (
              <img
                src={`${imageKitEndpoint}${viewingCard.startsWith("/") ? viewingCard : `/${viewingCard}`}`}
                alt="Student ID Card"
                className="max-w-full h-auto max-h-[450px] rounded-lg shadow-sm object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=ID+Card+Not+Found"; }}
              />
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button 
              onClick={() => setViewingCard(null)} 
              className="w-full bg-slate-900 text-white font-bold h-11 hover:bg-slate-800"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountRequestsTable;
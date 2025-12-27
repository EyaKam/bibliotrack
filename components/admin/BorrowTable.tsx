"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import BookCover from "@/components/BookCover";
import { BorrowTableActions } from "./BorrowTableActions"; // Integrated here
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteBorrowRecord } from "@/lib/admin/actions/Borrow";

interface BorrowRecordsTableProps {
  records: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    coverColor: string;
    borrowerName: string;
    borrowerEmail: string;
    status: string;
    createdAt: string | Date | null;
    [key: string]: any;
  }[];
}

const BorrowRecordsTable = ({ records }: BorrowRecordsTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    const result = await deleteBorrowRecord(deleteId);

    if (result.success) {
      toast.success("Success", {
        description: result.message,
      });
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error("Error", {
        description: result.message,
      });
    }
    setIsDeleting(false);
  };

  const formatDate = (date: string | Date | null) =>
    date ? new Date(date).toLocaleDateString("en-US") : "N/A";

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BORROWED":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "RETURNED":
        return "bg-green-100 text-green-600 border-green-200";
      case "OVERDUE":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-dark-400 font-medium">
            <tr className="border-b border-light-400">
              <th className="pb-4 pr-4">Book</th>
              <th className="pb-4 px-4">Borrower</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4 text-center">Update Status</th> {/* Added Header */}
              <th className="pb-4 px-4">Borrowed Date</th>
              <th className="pb-4 pl-4 text-right">Delete</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-light-400/50 transition hover:bg-light-400/10"
              >
                <td className="py-4 pr-4 align-middle">
                  <div className="flex items-center gap-3">
                    <BookCover
                      variant="Small"
                      coverColor={record.coverColor}
                      coverImage={record.coverUrl}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-dark-400 line-clamp-1">
                        {record.title}
                      </span>
                      <span className="text-xs text-light-500">
                        {record.author}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 align-middle">
                  <div className="flex flex-col">
                    <span className="font-medium text-dark-400">
                      {record.borrowerName}
                    </span>
                    <span className="text-xs text-light-500">
                      {record.borrowerEmail}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 align-middle">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>

                {/* Status Toggle Button Column */}
                <td className="py-4 px-4 align-middle text-center">
                  <BorrowTableActions 
                    recordId={record.id} 
                    status={record.status} 
                  />
                </td>

                <td className="py-4 px-4 align-middle text-dark-300">
                  {formatDate(record.createdAt)}
                </td>
                <td className="py-4 pl-4 align-middle text-right">
                  <button
                    onClick={() => setDeleteId(record.id)}
                    className="rounded p-2 text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <div className="py-12 text-center text-light-500">
            No borrow records found.
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this borrow record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
             <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BorrowRecordsTable;
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteBook } from "@/lib/admin/actions/Book";
import BookCover from "@/components/BookCover";
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

interface BookTableProps {
  books: {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    coverColor: string;
    createdAt: string | Date | null;
    [key: string]: any;
  }[];
}

const BookTable = ({ books }: BookTableProps) => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteBook(deleteId);

    if (result.success) {
      setDeleteId(null);
      router.refresh();
    } else {
      alert(result.message || "Failed to delete book");
    }
    setIsDeleting(false);
  };

  const formatDate = (date: string | Date | null) =>
    date ? new Date(date).toLocaleDateString("en-US") : "N/A";

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-light-400">
              <th className="pb-4 pr-4 text-left">Book</th>
              <th className="pb-4 px-4 text-left">Author</th>
              <th className="pb-4 px-4 text-left">Genre</th>
              <th className="pb-4 px-4 text-left">Created</th>
              <th className="pb-4 pl-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="cursor-pointer border-b transition hover:bg-light-400/30"
                onClick={() => router.push(`/admin/Books/${book.id}`)}
              >
                <td className="py-5 pr-4">
                  <div className="flex items-center gap-3">
                    <BookCover
                      variant="Small"
                      coverColor={book.coverColor}
                      coverImage={book.coverUrl}
                    />
                    <span className="font-medium text-dark-400 line-clamp-1">
                      {book.title}
                    </span>
                  </div>
                </td>
                <td className="py-5 px-4 text-dark-200">{book.author}</td>
                <td className="py-5 px-4 text-dark-200">{book.genre}</td>
                <td className="py-5 px-4 text-dark-200">
                  {formatDate(book.createdAt)}
                </td>
                <td className="py-5 pl-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/Books/${book.id}/edit`);
                      }}
                      className="rounded p-2 text-blue-500 hover:bg-blue-50"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(book.id);
                      }}
                      className="rounded p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <div className="py-12 text-center text-light-500">
            No books found.
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookTable;

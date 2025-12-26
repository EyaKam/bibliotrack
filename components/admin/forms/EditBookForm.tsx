"use client";

import React from "react";
import BookForm from "@/components/admin/forms/BookForm";
import { useRouter } from "next/navigation";

// Infer book type from your schema
interface BookType {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

interface EditBookFormProps {
  book: BookType;
}

const EditBookForm = ({ book }: EditBookFormProps) => {
  const router = useRouter();

  // BookForm does not accept onSubmit, it handles submission internally
  return <BookForm {...book} type="update" />;
};

export default EditBookForm;

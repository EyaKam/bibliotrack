"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createBorrowRecord } from "@/lib/admin/actions/Borrow";
import router from "next/router";
import { users } from "@/database/schema";

// Define schema locally for borrow records
const borrowSchema = z.object({
  userId: z.string().min(1, "User is required"),
  bookId: z.string().min(1, "Book is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["BORROWED", "RETURNED", "OVERDUE"]),
});

interface BorrowFormProps {
  users: { id: string; fullName: string; email: string }[];
  books: { id: string; title: string }[];
}

const BorrowForm = ({ users, books }: BorrowFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof borrowSchema>>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      userId: "",
      bookId: "",
      dueDate: new Date().toISOString().split("T")[0],
      status: "BORROWED",
    },
  });

  const onSubmit = async (values: z.infer<typeof borrowSchema>) => {
    const result = await createBorrowRecord(values);

    if (result.success) {
      toast.success("Success", { description: "Borrow record created" });
      router.push("/admin/borrow-records");
    } else {
      toast.error("Error", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* User Selection */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="book-form_input">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Book Selection */}
        <FormField
          control={form.control}
          name="bookId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="book-form_input">
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" className="book-form_input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="book-form_btn text-white">
          Create Record
        </Button>
      </form>
    </Form>
  );
};

export default BorrowForm;
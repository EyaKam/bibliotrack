"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createBorrowRecord } from "@/lib/admin/actions/Borrow";

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
      dueDate: "",
      status: "BORROWED",
    },
  });

  const onSubmit = async (values: z.infer<typeof borrowSchema>) => {
    const result = await createBorrowRecord(values);

    if (result.success) {
      toast.success("Success", {
        description: "Borrow record created successfully",
      });
      router.push("/admin/borrow-records");
    } else {
      toast.error("Error", {
        description: result.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* User Selection */}
        <Controller
          control={form.control}
          name="userId"
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Borrower
              </FieldLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="book-form_input min-h-[50px]">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />

        {/* Book Selection */}
        <Controller
          control={form.control}
          name="bookId"
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Book
              </FieldLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="book-form_input min-h-[50px]">
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />

        {/* Status Selection */}
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Status
              </FieldLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="book-form_input min-h-[50px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BORROWED">Borrowed</SelectItem>
                    <SelectItem value="RETURNED">Returned</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />

        {/* Due Date */}
        <Controller
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Due Date
              </FieldLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Select due date"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
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

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Form, FormControl } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";
import { toast } from "sonner";
import { createBook } from "@/lib/admin/actions/Book";


interface Props extends Partial<Book> {
  type?: "create" | "update";
}
const BookForm = ({ type, ...book }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema as any),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      genre: "",
      rating: 1,
      totalCopies: 1,
      coverUrl: "",
      coverColor: "",
      videoUrl: "",
      summary: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = await createBook({ ...values, availableCopies: values.totalCopies });
    if (result.success) {
      toast.success("Success", {
        description:'Book created successfully.',
      });

      router.push(`/admin/books/${result.data.id}`) ;


    } else {
      toast.error("error", {
        description: result.message,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          name={"title"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Book Title
              </FieldLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book title"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"author"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Author
              </FieldLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book author"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"genre"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Genre
              </FieldLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Book genre"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"rating"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Rating
              </FieldLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  required
                  placeholder="Book rating"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"totalCopies"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Total Copies
              </FieldLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  required
                  placeholder="Total copies"
                  {...field}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"coverUrl"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Book Image
              </FieldLabel>
              <FormControl>
                <FileUpload
                  type="image"
                  accept="image/*"
                  placeholder="Upload book image"
                  folder="/books/covers"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"coverColor"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Primary Color
              </FieldLabel>
              <FormControl>
                <ColorPicker
                  onPickerChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"description"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Book Description
              </FieldLabel>
              <FormControl>
                <Textarea
                  placeholder="Book description"
                  {...field}
                  rows={10}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"videoUrl"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Book Video
              </FieldLabel>
              <FormControl>
                <FileUpload
                  type="video"
                  accept="video/*"
                  placeholder="Upload book video"
                  folder="/books/videos"
                  variant="light"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Controller
          name={"summary"}
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-base font-normal text-dark-500">
                Book Summary
              </FieldLabel>
              <FormControl>
                <Textarea
                  placeholder="Book summary"
                  {...field}
                  rows={5}
                  className="book-form_input"
                />
              </FormControl>
              <FormMessage />
            </Field>
          )}
        />
        <Button type="submit" className="book-form_btn text-white">
          Add Book to Libary
        </Button>
      </form>
    </Form>
  );
};
export default BookForm;

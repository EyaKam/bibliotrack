import BookForm from "@/components/admin/forms/bookForm";
import { Button } from "@/components/ui/button";
import { Book, Link } from "lucide-react";
import React from "react";
import { FieldValues } from "react-hook-form";
const page = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>
      <section className="w-full max-w-2xl">
        <BookForm />
      </section>
    </>
  );
};
export default page;

"use client";
import React from "react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";

const Page = () => (
  <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
      email: "",
      password: "",
    }}
    onSubmit={async (data) => {
      return { success: true };
    }}
  />
);
export default Page;

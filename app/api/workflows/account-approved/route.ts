import { serve } from "@upstash/workflow/nextjs";
// Use the correct import path that works in your other workflow files
import { sendEmail } from "@/lib/workflow"; 

export const { POST } = serve(async (context) => {
  const { email, fullName } = context.requestPayload as { email: string; fullName: string };

  await context.run("send-approval-email", async () => {
    await sendEmail({
      email, // Your lib/workflow likely uses 'email' instead of 'to'
      subject: "Welcome to the Library! Your account is approved.",
      message: `Hi ${fullName}, your account has been approved by the admin. You can now log in and borrow books!`,
    });
  });
});
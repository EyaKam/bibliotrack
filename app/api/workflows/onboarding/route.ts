import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type UserState = "non-active" | "active";
type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastactivitydate = user[0].lastactivitydate ? new Date(user[0].lastactivitydate) : new Date();
  const now = new Date();
  const timeDifference = now.getTime() - lastactivitydate.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // 1. Account Approved Email (Triggered by Admin)
  await context.run("account-approved-notification", async () => {
    await sendEmail({
      email,
      subject: "Your Library Account is Approved!",
      message: `Great news ${fullName}! Your identity card has been verified. You can now access the library and borrow books.`,
    });
  });

  // Wait for 3 days before checking their activity for the first time
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "We miss you at the Library",
          message: `Hey ${fullName}, it's been a few days since you last visited. Come check out our new arrivals!`,
        });
      });
    } else if (state === "active") {
      // Optional: Send a tip or a "Thank you for using the library"
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Keep it up!",
          message: `We love seeing you active in the library, ${fullName}! Check your profile for upcoming book due dates.`,
        });
      });
    }

    // Check again in 30 days
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/lib/actions/users";

const RoleDropdown = ({
    userId,
    role,
}: {
    userId: string;
    role: "USER" | "ADMIN";
}) => {
    const [isPending, startTransition] = useTransition();

    return (
        <select
            value={role}
            disabled={isPending}
            onChange={(e) =>
                startTransition(() =>
                    updateUserRole(userId, e.target.value as "USER" | "ADMIN")
                )
            }
            className="rounded-md border px-2 py-1 text-sm"
        >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
        </select>
    );
};

export default RoleDropdown;

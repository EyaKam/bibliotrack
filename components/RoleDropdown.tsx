"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/lib/actions/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Assuming you use sonner or a similar toast lib

const RoleDropdown = ({
    userId,
    role,
}: {
    userId: string;
    role: "USER" | "ADMIN";
}) => {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (newRole: "USER" | "ADMIN") => {
        startTransition(async () => {
            try {
                await updateUserRole(userId, newRole);
                // Optional: add a success toast
                // toast.success(`Role updated to ${newRole}`);
            } catch (error) {
                console.error(error);
                // toast.error("Failed to update role");
            }
        });
    };

    return (
        <div className={`relative min-w-[100px] ${isPending ? "opacity-50" : "opacity-100"}`}>
            <Select 
                defaultValue={role} 
                onValueChange={(value) => handleRoleChange(value as "USER" | "ADMIN")}
                disabled={isPending}
            >
                <SelectTrigger className="h-8 w-fit border-none bg-light-200 font-semibold text-dark-200 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="border-light-300 bg-white">
                    <SelectItem value="USER" className="cursor-pointer hover:bg-light-300">User</SelectItem>
                    <SelectItem value="ADMIN" className="cursor-pointer hover:bg-light-300">Admin</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default RoleDropdown;
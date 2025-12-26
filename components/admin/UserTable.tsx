"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RoleDropdown from "@/components/RoleDropdown";

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: "USER" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  createdAt: Date | null;
};

const UserTable = ({ users }: { users: UserRow[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>University ID</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>
            <div className="text-right">Card</div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.fullName}
            </TableCell>

            <TableCell>{user.email}</TableCell>

            <TableCell>{user.universityId}</TableCell>

            <TableCell>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </TableCell>

            <TableCell>
              <span className="rounded-md bg-light-300 px-2 py-1 text-xs">
                {user.status}
              </span>
            </TableCell>

            <TableCell>
              <RoleDropdown userId={user.id} role={user.role} />
            </TableCell>

            <TableCell className="text-right">
              <a
                href={user.universityCard}
                target="_blank"
                className="text-primary-admin underline"
              >
                View
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;

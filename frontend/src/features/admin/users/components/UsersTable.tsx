// src/features/users/components/UsersTable.tsx
import type { User } from "../types/user.types";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import ToggleUserStatusButton from "./ToggleUserStatusButton";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <EditUserDialog user={user} />
                  <ToggleUserStatusButton user={user} />
                  <DeleteUserDialog user={user} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
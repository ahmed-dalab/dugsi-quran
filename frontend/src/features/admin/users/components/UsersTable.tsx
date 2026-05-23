import type { User } from "../types/user.types";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { panelClass, tableShellClass } from "@/design-system/nav";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import ToggleUserStatusButton from "./ToggleUserStatusButton";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <div key={user._id} className={panelClass}>
            <div className="space-y-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="primary">{user.role}</Badge>
              <StatusBadge preset={user.isActive ? "active" : "inactive"} />
            </div>

            <div className="mt-4 grid gap-2">
              <EditUserDialog user={user} triggerClassName="w-full justify-start" />
              <ToggleUserStatusButton user={user} className="w-full justify-start" />
              <DeleteUserDialog user={user} triggerClassName="w-full justify-start" />
            </div>
          </div>
        ))}
      </div>

      <div className={tableShellClass}>
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
                  <Badge variant="primary">{user.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge preset={user.isActive ? "active" : "inactive"} />
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
    </div>
  );
}

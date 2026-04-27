// src/features/users/components/ToggleUserStatusButton.tsx
import { Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import { useToggleUserStatusMutation } from "../api/userApi";
import type { User } from "../types/user.types";

import { Button } from "@/components/ui/button";

interface ToggleUserStatusButtonProps {
  user: User;
}

export default function ToggleUserStatusButton({ user }: ToggleUserStatusButtonProps) {
  const [toggleUserStatus, { isLoading }] = useToggleUserStatusMutation();

  async function handleToggle() {
    try {
      const updatedUser = await toggleUserStatus(user._id).unwrap();
      const status = updatedUser.isActive ? "activated" : "deactivated";
      toast.success(`User "${updatedUser.name}" ${status} successfully`);
    } catch (error: any) {
      console.error("Toggle user status failed:", error);
      toast.error(error?.data?.message || "Failed to update user status");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={`gap-2 ${
        user.isActive 
          ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" 
          : "text-green-600 hover:text-green-700 hover:bg-green-50"
      }`}
    >
      {user.isActive ? (
        <>
          <PowerOff className="h-4 w-4" />
          Deactivate
        </>
      ) : (
        <>
          <Power className="h-4 w-4" />
          Activate
        </>
      )}
    </Button>
  );
}

// src/features/users/components/ToggleUserStatusButton.tsx
import { Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import { handleMutationError } from "@/lib/apiError";
import { useToggleUserStatusMutation } from "../api/userApi";
import type { User } from "../types/user.types";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToggleUserStatusButtonProps {
  user: User;
  className?: string;
}

export default function ToggleUserStatusButton({ user, className }: ToggleUserStatusButtonProps) {
  const [toggleUserStatus, { isLoading }] = useToggleUserStatusMutation();

  async function handleToggle() {
    try {
      const updatedUser = await toggleUserStatus(user._id).unwrap();
      const status = updatedUser.data.isActive ? "activated" : "deactivated";
      toast.success(`User "${updatedUser.data.name}" ${status} successfully`);
    } catch (error: unknown) {
      handleMutationError("Toggle user status failed", error, "Failed to update user status");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "gap-2",
        user.isActive ? "text-warning hover:text-warning" : "text-success hover:text-success",
        className
      )}
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

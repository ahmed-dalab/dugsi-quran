// src/features/users/components/DeleteUserDialog.tsx
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteUserMutation } from "../api/userApi";
import type { User } from "../types/user.types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DeleteUserDialogProps {
  user: User;
}

export default function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  async function handleDelete() {
    try {
      await deleteUser(user._id).unwrap();
      toast.success(`User "${user.name}" deleted successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Delete user failed:", error);
      toast.error(error?.data?.message || "Failed to delete user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{user.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>User Information:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><strong>Name:</strong> {user.name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Role:</strong> {user.role}</li>
              <li><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

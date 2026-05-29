import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleMutationError } from "@/lib/apiError";
import { useDeleteTeacherMutation } from "../api/teacherApi";
import type { Teacher } from "../types/teacher.types";

interface DeleteTeacherDialogProps {
  teacher: Teacher;
  triggerClassName?: string;
}

export default function DeleteTeacherDialog({
  teacher,
  triggerClassName,
}: DeleteTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteTeacher, { isLoading }] = useDeleteTeacherMutation();

  const userName = typeof teacher.userId === "string" ? "Unknown" : (teacher.userId as any).name;

  async function handleDelete() {
    try {
      await deleteTeacher(teacher._id).unwrap();
      toast.success(`Teacher "${userName}" deleted successfully`);
      setOpen(false);
    } catch (error: unknown) {
      handleMutationError("Delete teacher failed", error, "Failed to delete teacher");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={cn("gap-2", triggerClassName)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Teacher</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{userName}"? This action cannot be undone and will also remove their user account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Deleting..." : "Delete Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

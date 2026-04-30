import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    } catch (error: any) {
      console.error("Delete teacher failed:", error);
      toast.error(error?.data?.message || "Failed to delete teacher");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 ${triggerClassName ?? ""}`}
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

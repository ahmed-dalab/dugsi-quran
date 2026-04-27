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
import { useDeleteStudentMutation } from "../api/studentApi";
import type { Student } from "../types/student.types";

interface DeleteStudentDialogProps {
  student: Student;
  triggerClassName?: string;
}

export default function DeleteStudentDialog({
  student,
  triggerClassName,
}: DeleteStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteStudent, { isLoading }] = useDeleteStudentMutation();

  async function handleDelete() {
    try {
      await deleteStudent(student._id).unwrap();
      toast.success(`Student "${student.fullName}" deleted successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Delete student failed:", error);
      toast.error(error?.data?.message || "Failed to delete student");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 text-destructive hover:text-destructive ${triggerClassName ?? ""}`}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{student.fullName}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Deleting..." : "Delete Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { useDeleteClassMutation } from "../api/classApi";
import type { ClassItem } from "../types/class.types";

interface DeleteClassDialogProps {
  classItem: ClassItem;
  triggerClassName?: string;
}

export default function DeleteClassDialog({
  classItem,
  triggerClassName,
}: DeleteClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteClass, { isLoading }] = useDeleteClassMutation();

  async function handleDelete() {
    try {
      await deleteClass(classItem._id).unwrap();
      toast.success(`Class "${classItem.name}" deleted successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Delete class failed:", error);
      toast.error(error?.data?.message || "Failed to delete class");
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
          <DialogTitle className="text-destructive">Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{classItem.name}"? This action cannot
            be undone.
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
            {isLoading ? "Deleting..." : "Delete Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

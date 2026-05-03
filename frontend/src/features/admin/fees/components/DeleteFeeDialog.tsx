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
import { useDeleteFeeMutation } from "../api/feeApi";
import type { FeePayment } from "../types/fee.types";

interface DeleteFeeDialogProps {
  fee: FeePayment;
  triggerClassName?: string;
}

export default function DeleteFeeDialog({ fee, triggerClassName }: DeleteFeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteFee, { isLoading }] = useDeleteFeeMutation();

  async function handleDelete() {
    try {
      await deleteFee(fee._id).unwrap();
      toast.success("Fee payment deleted successfully");
      setOpen(false);
    } catch (error: any) {
      console.error("Delete fee failed:", error);
      toast.error(error?.data?.message || "Failed to delete fee payment");
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
          <DialogTitle className="text-destructive">Delete Fee Payment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this fee payment record? This action cannot be undone.
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
            {isLoading ? "Deleting..." : "Delete Fee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { handleMutationError } from "@/lib/apiError";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateFeeMutation } from "../api/feeApi";
import { editFeeSchema, type EditFeeFormValues } from "../schemas/editFeeSchema";
import type { FeePayment } from "../types/fee.types";

interface EditFeeDialogProps {
  fee: FeePayment;
  triggerClassName?: string;
}

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const formatPeriod = (month: number, year: number) =>
  new Date(year, month - 1, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

export default function EditFeeDialog({ fee, triggerClassName }: EditFeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateFee, { isLoading }] = useUpdateFeeMutation();

  const studentName = typeof fee.studentId === "string" ? "-" : fee.studentId.fullName;
  const className = typeof fee.classId === "string" ? "-" : fee.classId.name;

  const form = useForm<EditFeeFormValues>({
    resolver: zodResolver(editFeeSchema),
    defaultValues: {
      amountPaid: fee.amountPaid,
      paymentDate: fee.paymentDate ? fee.paymentDate.slice(0, 10) : "",
      note: fee.note ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      amountPaid: fee.amountPaid,
      paymentDate: fee.paymentDate ? fee.paymentDate.slice(0, 10) : "",
      note: fee.note ?? "",
    });
  }, [fee, form, open]);

  async function onSubmit(values: EditFeeFormValues) {
    try {
      if (values.amountPaid > fee.amountDue) {
        toast.error("Amount paid cannot exceed the class monthly fee");
        return;
      }

      await updateFee({
        id: fee._id,
        body: {
          amountPaid: values.amountPaid,
          paymentDate: values.amountPaid > 0 ? values.paymentDate : null,
          note: values.note?.trim() ? values.note.trim() : null,
        },
      }).unwrap();

      toast.success("Fee payment updated successfully");
      setOpen(false);
    } catch (error: unknown) {
      handleMutationError("Update fee failed", error, "Failed to update fee payment");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 ${triggerClassName ?? ""}`}>
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Fee Payment</DialogTitle>
          <DialogDescription>Update the payment amount or note for this fee record.</DialogDescription>
        </DialogHeader>

        <form id="edit-fee-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
              <p className="font-medium">{studentName}</p>
              <p className="mt-1 text-muted-foreground">
                Class: <span className="text-foreground">{className}</span>
              </p>
              <p className="text-muted-foreground">
                Period: <span className="text-foreground">{formatPeriod(fee.month, fee.year)}</span>
              </p>
              <p className="text-muted-foreground">
                Class fee:{" "}
                <span className="font-medium text-foreground">{formatCurrency(fee.amountDue)}</span>
              </p>
            </div>

            <Controller
              name="amountPaid"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-fee-amount-paid">Amount Paid</FieldLabel>
                  <Input
                    {...field}
                    id="edit-fee-amount-paid"
                    type="number"
                    min={0}
                    step="0.01"
                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="paymentDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-fee-payment-date">Payment Date</FieldLabel>
                  <Input {...field} id="edit-fee-payment-date" type="date" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-fee-note">Note (optional)</FieldLabel>
                  <Input {...field} id="edit-fee-note" placeholder="Optional note" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="edit-fee-form" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Updating..." : "Update Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

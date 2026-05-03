import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateFeeMutation } from "../api/feeApi";
import { editFeeSchema, type EditFeeFormValues } from "../schemas/editFeeSchema";
import type { FeePayment } from "../types/fee.types";

interface EditFeeDialogProps {
  fee: FeePayment;
  triggerClassName?: string;
}

export default function EditFeeDialog({ fee, triggerClassName }: EditFeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateFee, { isLoading }] = useUpdateFeeMutation();

  const form = useForm<EditFeeFormValues>({
    resolver: zodResolver(editFeeSchema),
    defaultValues: {
      month: fee.month,
      year: fee.year,
      amountDue: fee.amountDue,
      amountPaid: fee.amountPaid,
      paymentDate: fee.paymentDate ? fee.paymentDate.slice(0, 10) : "",
      note: fee.note ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      month: fee.month,
      year: fee.year,
      amountDue: fee.amountDue,
      amountPaid: fee.amountPaid,
      paymentDate: fee.paymentDate ? fee.paymentDate.slice(0, 10) : "",
      note: fee.note ?? "",
    });
  }, [fee, form, open]);

  async function onSubmit(values: EditFeeFormValues) {
    try {
      if (values.amountPaid > values.amountDue) {
        toast.error("Amount paid cannot exceed amount due");
        return;
      }

      await updateFee({
        id: fee._id,
        body: {
          ...values,
          paymentDate: values.amountPaid > 0 ? values.paymentDate : null,
          note: values.note?.trim() ? values.note.trim() : null,
        },
      }).unwrap();

      toast.success("Fee payment updated successfully");
      setOpen(false);
    } catch (error: any) {
      console.error("Update fee failed:", error);
      toast.error(error?.data?.message || "Failed to update fee payment");
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
          <DialogDescription>Update monthly fee details.</DialogDescription>
        </DialogHeader>

        <form id="edit-fee-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="month"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-fee-month">Month</FieldLabel>
                    <Input
                      {...field}
                      id="edit-fee-month"
                      type="number"
                      min={1}
                      max={12}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-fee-year">Year</FieldLabel>
                    <Input
                      {...field}
                      id="edit-fee-year"
                      type="number"
                      min={2000}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="amountDue"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-fee-amount-due">Amount Due</FieldLabel>
                    <Input
                      {...field}
                      id="edit-fee-amount-due"
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
            </div>

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
            {isLoading ? "Updating..." : "Update Fee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

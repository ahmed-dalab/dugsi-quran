import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { HandCoins } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useGetStudentsQuery } from "@/features/admin/students/api/studentApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateFeeMutation } from "../api/feeApi";
import { createFeeSchema, type CreateFeeFormValues } from "../schemas/createFeeSchema";

interface CreateFeeDialogProps {
  triggerClassName?: string;
}

const now = new Date();

export default function CreateFeeDialog({ triggerClassName }: CreateFeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [createFee, { isLoading }] = useCreateFeeMutation();
  const { data: studentsData } = useGetStudentsQuery();

  const form = useForm<CreateFeeFormValues>({
    resolver: zodResolver(createFeeSchema),
    defaultValues: {
      studentId: "",
      classId: "",
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amountDue: 0,
      amountPaid: 0,
      paymentDate: now.toISOString().slice(0, 10),
      note: "",
    },
  });

  const selectedStudentId = form.watch("studentId");

  async function onSubmit(values: CreateFeeFormValues) {
    try {
      if (values.amountPaid > values.amountDue) {
        toast.error("Amount paid cannot exceed amount due");
        return;
      }

      const payload = {
        ...values,
        paymentDate: values.amountPaid > 0 ? values.paymentDate : null,
        note: values.note?.trim() ? values.note.trim() : null,
      };

      const newFee = await createFee(payload).unwrap();
      const studentName =
        typeof newFee.data.studentId === "string"
          ? "student"
          : newFee.data.studentId.fullName;

      toast.success(`Fee record created for ${studentName}`);
      form.reset({
        studentId: "",
        classId: "",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amountDue: 0,
        amountPaid: 0,
        paymentDate: now.toISOString().slice(0, 10),
        note: "",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Create fee failed:", error);
      toast.error(error?.data?.message || "Failed to create fee record");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 ${triggerClassName ?? ""}`}>
          <HandCoins className="h-4 w-4" />
          Add Fee
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Fee Payment</DialogTitle>
          <DialogDescription>
            Create a monthly fee record for a student.
          </DialogDescription>
        </DialogHeader>

        <form id="create-fee-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="studentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Student</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const student = studentsData?.data.find((item) => item._id === value);
                      if (!student) return;
                      const classId =
                        typeof student.classId === "string"
                          ? student.classId
                          : student.classId._id;
                      form.setValue("classId", classId, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentsData?.data.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="classId"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedStudent = studentsData?.data.find((s) => s._id === selectedStudentId);
                const className =
                  selectedStudent && typeof selectedStudent.classId !== "string"
                    ? selectedStudent.classId.name
                    : "";

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fee-class">Class</FieldLabel>
                    <Input
                      id="fee-class"
                      value={className}
                      placeholder="Class auto-filled from student"
                      readOnly
                    />
                    <input type="hidden" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="month"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fee-month">Month</FieldLabel>
                    <Input
                      {...field}
                      id="fee-month"
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
                    <FieldLabel htmlFor="fee-year">Year</FieldLabel>
                    <Input
                      {...field}
                      id="fee-year"
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
                    <FieldLabel htmlFor="fee-amount-due">Amount Due</FieldLabel>
                    <Input
                      {...field}
                      id="fee-amount-due"
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
                    <FieldLabel htmlFor="fee-amount-paid">Amount Paid</FieldLabel>
                    <Input
                      {...field}
                      id="fee-amount-paid"
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
                  <FieldLabel htmlFor="fee-payment-date">Payment Date</FieldLabel>
                  <Input {...field} id="fee-payment-date" type="date" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fee-note">Note (optional)</FieldLabel>
                  <Input {...field} id="fee-note" placeholder="Optional note" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="create-fee-form" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Creating..." : "Create Fee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

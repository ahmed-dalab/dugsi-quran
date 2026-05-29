import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { HandCoins } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { useGetStudentsQuery } from "@/features/admin/students/api/studentApi";
import { LIST_ALL_PARAMS } from "@/lib/pagination";
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
import { AppSelect } from "@/components/ui/select";
import { useCreateFeeMutation } from "../api/feeApi";
import { createFeeSchema, type CreateFeeFormValues } from "../schemas/createFeeSchema";

interface CreateFeeDialogProps {
  triggerClassName?: string;
}

const now = new Date();
const today = now.toISOString().slice(0, 10);
const currentPeriodLabel = now.toLocaleString(undefined, { month: "long", year: "numeric" });

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function CreateFeeDialog({ triggerClassName }: CreateFeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [createFee, { isLoading }] = useCreateFeeMutation();

  const { data: studentsData, isLoading: isStudentsLoading } = useGetStudentsQuery(
    { ...LIST_ALL_PARAMS, status: "active" },
    { skip: !open }
  );

  const { data: classesData } = useGetClassesQuery(LIST_ALL_PARAMS, { skip: !open });

  const form = useForm<CreateFeeFormValues>({
    resolver: zodResolver(createFeeSchema),
    defaultValues: {
      studentId: "",
      amountPaid: 0,
      paymentDate: today,
      note: "",
    },
  });

  const selectedStudentId = form.watch("studentId");

  const studentOptions = useMemo(
    () =>
      studentsData?.data.map((student) => ({
        value: student._id,
        label: student.fullName,
      })) ?? [],
    [studentsData?.data]
  );

  const selectedStudent = useMemo(
    () => studentsData?.data.find((student) => student._id === selectedStudentId),
    [studentsData?.data, selectedStudentId]
  );

  const selectedClass = useMemo(() => {
    if (!selectedStudent) {
      return null;
    }

    const classId =
      typeof selectedStudent.classId === "string"
        ? selectedStudent.classId
        : selectedStudent.classId._id;

    return classesData?.data.find((classItem) => classItem._id === classId) ?? null;
  }, [selectedStudent, classesData?.data]);

  useEffect(() => {
    if (!selectedClass) {
      return;
    }

    form.setValue("amountPaid", selectedClass.monthlyFee, { shouldValidate: true });
  }, [selectedStudentId, selectedClass, form]);

  async function onSubmit(values: CreateFeeFormValues) {
    try {
      if (selectedClass && values.amountPaid > selectedClass.monthlyFee) {
        toast.error("Amount paid cannot exceed the class monthly fee");
        return;
      }

      const payload = {
        studentId: values.studentId,
        amountPaid: values.amountPaid,
        paymentDate: values.amountPaid > 0 ? values.paymentDate : null,
        note: values.note?.trim() ? values.note.trim() : null,
      };

      const newFee = await createFee(payload).unwrap();
      const studentName =
        typeof newFee.data.studentId === "string"
          ? "student"
          : newFee.data.studentId.fullName;

      toast.success(`${studentName} paid fee for ${currentPeriodLabel}`);
      form.reset({
        studentId: "",
        amountPaid: 0,
        paymentDate: today,
        note: "",
      });
      setOpen(false);
    } catch (error: unknown) {
      handleMutationError("Create fee failed", error, "Failed to create fee record");
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
          <DialogTitle>Record Fee Payment</DialogTitle>
          <DialogDescription>
            Record that a student paid their class fee for {currentPeriodLabel}.
          </DialogDescription>
        </DialogHeader>

        <form id="create-fee-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="studentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fee-student">Student</FieldLabel>
                  <AppSelect
                    id="fee-student"
                    value={field.value || null}
                    onChange={(value) => field.onChange(value ?? "")}
                    invalid={fieldState.invalid}
                    placeholder={
                      isStudentsLoading ? "Loading students..." : "Search and select student"
                    }
                    isLoading={isStudentsLoading}
                    isDisabled={isStudentsLoading}
                    options={studentOptions}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {selectedStudent && selectedClass ? (
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                <p className="font-medium">{selectedStudent.fullName}</p>
                <p className="mt-1 text-muted-foreground">
                  Class: <span className="text-foreground">{selectedClass.name}</span>
                </p>
                <p className="text-muted-foreground">
                  Period: <span className="text-foreground">{currentPeriodLabel}</span>
                </p>
                <p className="text-muted-foreground">
                  Class fee:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(selectedClass.monthlyFee)}
                  </span>
                </p>
              </div>
            ) : selectedStudentId ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                Could not load class fee for this student.
              </div>
            ) : null}

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
            {isLoading ? "Saving..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

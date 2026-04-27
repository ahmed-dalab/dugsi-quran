import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateStudentMutation } from "../api/studentApi";
import { editStudentSchema, type EditStudentFormValues } from "../schemas/editStudentSchema";
import type { Student } from "../types/student.types";

interface EditStudentDialogProps {
  student: Student;
  triggerClassName?: string;
}

const asDateInputValue = (value?: string | null) => (value ? value.slice(0, 10) : "");

export default function EditStudentDialog({
  student,
  triggerClassName,
}: EditStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateStudent, { isLoading }] = useUpdateStudentMutation();
  const { data: classesData } = useGetClassesQuery();

  const classId =
    typeof student.classId === "string" ? student.classId : student.classId._id;

  const form = useForm<EditStudentFormValues>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      fullName: student.fullName,
      gender: student.gender,
      dateOfBirth: asDateInputValue(student.dateOfBirth),
      guardianName: student.guardianName ?? "",
      guardianPhone: student.guardianPhone,
      classId,
      registrationDate: asDateInputValue(student.registrationDate),
      status: student.status,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        fullName: student.fullName,
        gender: student.gender,
        dateOfBirth: asDateInputValue(student.dateOfBirth),
        guardianName: student.guardianName ?? "",
        guardianPhone: student.guardianPhone,
        classId: typeof student.classId === "string" ? student.classId : student.classId._id,
        registrationDate: asDateInputValue(student.registrationDate),
        status: student.status,
      });
    }
  }, [form, open, student]);

  async function onSubmit(values: EditStudentFormValues) {
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth?.trim() ? values.dateOfBirth : null,
        guardianName: values.guardianName?.trim() ? values.guardianName : null,
      };

      const updatedStudent = await updateStudent({
        id: student._id,
        body: payload,
      }).unwrap();

      toast.success(`Student "${updatedStudent.data.fullName}" updated successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Update student failed:", error);
      toast.error(error?.data?.message || "Failed to update student");
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
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student details and class assignment.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-student-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`student-full-name-${student._id}`}>Full Name</FieldLabel>
                  <Input
                    {...field}
                    id={`student-full-name-${student._id}`}
                    placeholder="Enter student full name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Gender</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="classId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Class</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classesData?.data.map((classItem) => (
                        <SelectItem key={classItem._id} value={classItem._id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="guardianPhone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`student-guardian-phone-${student._id}`}>Guardian Phone</FieldLabel>
                  <Input
                    {...field}
                    id={`student-guardian-phone-${student._id}`}
                    placeholder="Enter guardian phone"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="guardianName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`student-guardian-name-${student._id}`}>Guardian Name (optional)</FieldLabel>
                  <Input
                    {...field}
                    id={`student-guardian-name-${student._id}`}
                    placeholder="Enter guardian name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="dateOfBirth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`student-dob-${student._id}`}>Date of Birth (optional)</FieldLabel>
                  <Input
                    {...field}
                    id={`student-dob-${student._id}`}
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="registrationDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`student-registration-date-${student._id}`}>Registration Date</FieldLabel>
                  <Input
                    {...field}
                    id={`student-registration-date-${student._id}`}
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="edit-student-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

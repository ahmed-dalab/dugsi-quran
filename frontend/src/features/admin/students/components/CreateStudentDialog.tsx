import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { LIST_ALL_PARAMS } from "@/lib/pagination";
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
import { AppSelect } from "@/components/ui/select";
import { useCreateStudentMutation } from "../api/studentApi";
import {
  createStudentSchema,
  type CreateStudentFormValues,
} from "../schemas/createStudentSchema";

interface CreateStudentDialogProps {
  triggerClassName?: string;
}

const today = new Date().toISOString().slice(0, 10);

export default function CreateStudentDialog({
  triggerClassName,
}: CreateStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: classesData } = useGetClassesQuery(LIST_ALL_PARAMS);

  const form = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      fullName: "",
      gender: "male",
      dateOfBirth: "",
      guardianName: "",
      guardianPhone: "",
      classId: "",
      registrationDate: today,
      status: "active",
    },
  });

  async function onSubmit(values: CreateStudentFormValues) {
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth?.trim() ? values.dateOfBirth : null,
        guardianName: values.guardianName?.trim() ? values.guardianName : null,
      };

      const newStudent = await createStudent(payload).unwrap();
      toast.success(`Student "${newStudent.data.fullName}" created successfully`);
      form.reset({
        fullName: "",
        gender: "male",
        dateOfBirth: "",
        guardianName: "",
        guardianPhone: "",
        classId: "",
        registrationDate: today,
        status: "active",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Create student failed:", error);
      toast.error(error?.data?.message || "Failed to create student");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 ${triggerClassName ?? ""}`}>
          <UserPlus className="h-4 w-4" />
          Create Student
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Student</DialogTitle>
          <DialogDescription>
            Add a student and assign to a class.
          </DialogDescription>
        </DialogHeader>

        <form id="create-student-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="student-full-name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="student-full-name"
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
                  <AppSelect
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    placeholder="Select gender"
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                  />
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
                  <AppSelect
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    placeholder="Search and select class"
                    options={
                      classesData?.data.map((classItem) => ({
                        value: classItem._id,
                        label: classItem.name,
                      })) ?? []
                    }
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="guardianPhone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="student-guardian-phone">Guardian Phone</FieldLabel>
                  <Input
                    {...field}
                    id="student-guardian-phone"
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
                  <FieldLabel htmlFor="student-guardian-name">Guardian Name (optional)</FieldLabel>
                  <Input
                    {...field}
                    id="student-guardian-name"
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
                  <FieldLabel htmlFor="student-dob">Date of Birth (optional)</FieldLabel>
                  <Input
                    {...field}
                    id="student-dob"
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
                  <FieldLabel htmlFor="student-registration-date">Registration Date</FieldLabel>
                  <Input
                    {...field}
                    id="student-registration-date"
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
                  <AppSelect
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    placeholder="Select status"
                    isSearchable={false}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-student-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Creating..." : "Create Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

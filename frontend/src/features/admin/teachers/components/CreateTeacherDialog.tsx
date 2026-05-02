import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTeacherMutation } from "../api/teacherApi";
import {
  createTeacherSchema,
  type CreateTeacherFormValues,
} from "../schemas/createTeacherSchema";

interface CreateTeacherDialogProps {
  triggerClassName?: string;
}

const today = new Date().toISOString().slice(0, 10);

export default function CreateTeacherDialog({
  triggerClassName,
}: CreateTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();

  const form = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      gender: "male",
      hireDate: today,
      status: "active",
    },
  });

  async function onSubmit(values: CreateTeacherFormValues) {
    try {
      const payload = {
        ...values,
        phone: values.phone?.trim() ? values.phone : undefined,
        address: values.address?.trim() ? values.address : undefined,
      };

      const newTeacher = await createTeacher(payload).unwrap();
      const createdTeacherName =
        typeof newTeacher.data.userId === "string" ? "Teacher" : newTeacher.data.userId.name;
      toast.success(`Teacher "${createdTeacherName}" created successfully`);
      form.reset({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "male",
        hireDate: today,
        status: "active",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Create teacher failed:", error);
      toast.error(error?.data?.message || "Failed to create teacher");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 ${triggerClassName ?? ""}`}>
          <UserPlus className="h-4 w-4" />
          Create Teacher
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Teacher</DialogTitle>
          <DialogDescription>
            Add a new teacher to the system with their login credentials.
          </DialogDescription>
        </DialogHeader>

        <form id="create-teacher-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teacher-name">Full Name *</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-name"
                    placeholder="Enter teacher full name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teacher-email">Email *</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-email"
                    type="email"
                    placeholder="Enter email address"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teacher-password">Password *</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-password"
                    type="password"
                    placeholder="Enter password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teacher-phone">Phone</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-phone"
                    placeholder="Enter phone number"
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
              name="hireDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teacher-hire-date">Hire Date</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-hire-date"
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

            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                  <FieldLabel htmlFor="teacher-address">Address</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-address"
                    placeholder="Enter address"
                    aria-invalid={fieldState.invalid}
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
            form="create-teacher-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Creating..." : "Create Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

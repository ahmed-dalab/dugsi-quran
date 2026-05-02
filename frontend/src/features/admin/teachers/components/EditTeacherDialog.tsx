import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Edit } from "lucide-react";
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
import { useUpdateTeacherMutation } from "../api/teacherApi";
import type { Teacher } from "../types/teacher.types";
import { createTeacherSchema } from "../schemas/createTeacherSchema";

interface EditTeacherDialogProps {
  teacher: Teacher;
  triggerClassName?: string;
}

export default function EditTeacherDialog({
  teacher,
  triggerClassName,
}: EditTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();

  const userName = typeof teacher.userId === "string" ? "" : (teacher.userId as any).name;
  const userEmail = typeof teacher.userId === "string" ? "" : (teacher.userId as any).email;

  const form = useForm({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      name: userName,
      email: userEmail,
      password: "",
      phone: teacher.phone || "",
      address: teacher.address || "",
      gender: teacher.gender || "male",
      hireDate: teacher.hireDate?.split("T")[0] || "",
      status: teacher.status,
    },
  });

  async function onSubmit(values: any) {
    try {
      const payload = {
        ...values,
        phone: values.phone?.trim() ? values.phone : undefined,
        address: values.address?.trim() ? values.address : undefined,
        password: values.password?.trim() ? values.password : undefined,
      };

      const updatedTeacher = await updateTeacher({ id: teacher._id, body: payload }).unwrap();
      toast.success(`Teacher "${(updatedTeacher.data.userId as any).name}" updated successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Update teacher failed:", error);
      toast.error(error?.data?.message || "Failed to update teacher");
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

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Update teacher information. Leave password empty to keep current password.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-teacher-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FieldLabel htmlFor="teacher-password">Password (leave empty to keep current)</FieldLabel>
                  <Input
                    {...field}
                    id="teacher-password"
                    type="password"
                    placeholder="Enter new password"
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
            form="edit-teacher-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

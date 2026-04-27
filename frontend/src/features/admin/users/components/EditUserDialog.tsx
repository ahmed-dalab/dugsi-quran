// src/features/users/components/EditUserDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { toast } from "sonner";

import { useUpdateUserMutation } from "../api/userApi";
import {
  editUserSchema,
  type EditUserFormValues,
} from "../schemas/editUserSchema";
import type { User } from "../types/user.types";

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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface EditUserDialogProps {
  user: User;
}

export default function EditUserDialog({ user }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });

  async function onSubmit(values: EditUserFormValues) {
    try {
      const updatedUser = await updateUser({
        id: user._id,
        body: values,
      }).unwrap();
      
      toast.success(`User "${updatedUser.name}" updated successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Update user failed:", error);
      toast.error(error?.data?.message || "Failed to update user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and settings.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-user-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="user-name"
                    placeholder="Enter full name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="user-email"
                    type="email"
                    placeholder="Enter email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <FieldLabel>Active User</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable this user account.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="edit-user-form"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

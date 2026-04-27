// src/features/users/components/CreateUserDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useCreateUserMutation } from "../api/userApi";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "../schemas/createUserSchema";

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

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "teacher",
      isActive: true,
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    try {
      const newUser = await createUser(values).unwrap();
      toast.success(`User "${newUser.name}" created successfully`);
      form.reset({
        name: "",
        email: "",
        password: "",
        role: "teacher",
        isActive: true,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Create user failed:", error);
      toast.error(error?.data?.message || "Failed to create user");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Add a new system user and assign their role.
          </DialogDescription>
        </DialogHeader>

        <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)}>
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="user-password"
                    type="password"
                    placeholder="Enter password"
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
                      Enable this user account immediately.
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
            form="create-user-form"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
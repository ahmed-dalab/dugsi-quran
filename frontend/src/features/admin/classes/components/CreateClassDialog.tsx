import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useCreateClassMutation } from "../api/classApi";
import {
  createClassSchema,
  type CreateClassFormValues,
} from "../schemas/createClassSchema";

interface CreateClassDialogProps {
  triggerClassName?: string;
}

export default function CreateClassDialog({
  triggerClassName,
}: CreateClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [createClass, { isLoading }] = useCreateClassMutation();

  const form = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      levelOrder: 1,
      monthlyFee: 0,
      teacherId: "",
      isActive: true,
    },
  });

  async function onSubmit(values: CreateClassFormValues) {
    try {
      const payload = {
        ...values,
        teacherId: values.teacherId?.trim() ? values.teacherId.trim() : null,
      };

      const newClass = await createClass(payload).unwrap();
      toast.success(`Class "${newClass.data.name}" created successfully`);
      form.reset({
        name: "",
        levelOrder: 1,
        monthlyFee: 0,
        teacherId: "",
        isActive: true,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Create class failed:", error);
      toast.error(error?.data?.message || "Failed to create class");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 ${triggerClassName ?? ""}`}>
          <Plus className="h-4 w-4" />
          Create Class
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>
            Add a new class and set its level and monthly fee.
          </DialogDescription>
        </DialogHeader>

        <form id="create-class-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="class-name">Class Name</FieldLabel>
                  <Input
                    {...field}
                    id="class-name"
                    placeholder="Enter class name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="levelOrder"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="class-level-order">Level Order</FieldLabel>
                  <Input
                    {...field}
                    id="class-level-order"
                    type="number"
                    min={1}
                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="monthlyFee"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="class-monthly-fee">Monthly Fee</FieldLabel>
                  <Input
                    {...field}
                    id="class-monthly-fee"
                    type="number"
                    min={0}
                    step="0.01"
                    onChange={(event) => field.onChange(event.target.valueAsNumber)}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="teacherId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="class-teacher-id">Teacher ID (optional)</FieldLabel>
                  <Input
                    {...field}
                    id="class-teacher-id"
                    placeholder="Enter teacher user id"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <FieldLabel>Active Class</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable this class immediately.
                    </p>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-class-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Creating..." : "Create Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateClassMutation } from "../api/classApi";
import {
  editClassSchema,
  type EditClassFormValues,
} from "../schemas/editClassSchema";
import type { ClassItem } from "../types/class.types";

interface EditClassDialogProps {
  classItem: ClassItem;
  triggerClassName?: string;
}

export default function EditClassDialog({
  classItem,
  triggerClassName,
}: EditClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateClass, { isLoading }] = useUpdateClassMutation();

  const form = useForm<EditClassFormValues>({
    resolver: zodResolver(editClassSchema),
    defaultValues: {
      name: classItem.name,
      levelOrder: classItem.levelOrder,
      monthlyFee: classItem.monthlyFee,
      teacherId: classItem.teacherId ?? "",
      isActive: classItem.isActive,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: classItem.name,
        levelOrder: classItem.levelOrder,
        monthlyFee: classItem.monthlyFee,
        teacherId: classItem.teacherId ?? "",
        isActive: classItem.isActive,
      });
    }
  }, [classItem, form, open]);

  async function onSubmit(values: EditClassFormValues) {
    try {
      const payload = {
        ...values,
        teacherId: values.teacherId?.trim() ? values.teacherId.trim() : null,
      };

      const updatedClass = await updateClass({
        id: classItem._id,
        body: payload,
      }).unwrap();

      toast.success(`Class "${updatedClass.data.name}" updated successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Update class failed:", error);
      toast.error(error?.data?.message || "Failed to update class");
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
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>
            Update class information and status.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-class-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-class-name">Class Name</FieldLabel>
                  <Input
                    {...field}
                    id="edit-class-name"
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
                  <FieldLabel htmlFor="edit-class-level-order">Level Order</FieldLabel>
                  <Input
                    {...field}
                    id="edit-class-level-order"
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
                  <FieldLabel htmlFor="edit-class-monthly-fee">Monthly Fee</FieldLabel>
                  <Input
                    {...field}
                    id="edit-class-monthly-fee"
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
                  <FieldLabel htmlFor="edit-class-teacher-id">Teacher ID (optional)</FieldLabel>
                  <Input
                    {...field}
                    id="edit-class-teacher-id"
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
                      Enable or disable this class.
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
            form="edit-class-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

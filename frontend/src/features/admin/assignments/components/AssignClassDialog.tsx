import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { useGetTeachersQuery } from "@/features/admin/teachers/api/teacherApi";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAssignmentMutation } from "../api/assignmentApi";
import { z } from "zod";

const createAssignmentSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  classId: z.string().min(1, "Class is required"),
  notes: z.string().optional(),
});

type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;

interface AssignClassDialogProps {
  triggerClassName?: string;
}

export default function AssignClassDialog({
  triggerClassName,
}: AssignClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();
  const { data: teachersData } = useGetTeachersQuery();
  const { data: classesData } = useGetClassesQuery();

  const form = useForm<CreateAssignmentFormValues>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      teacherId: "",
      classId: "",
      notes: "",
    },
  });

  async function onSubmit(values: CreateAssignmentFormValues) {
    try {
      const payload = {
        ...values,
        notes: values.notes?.trim() || undefined,
      };

      const newAssignment = await createAssignment(payload).unwrap();
      
      // Get teacher and class names for the success message
      const teacherName = typeof newAssignment.data.teacherId === "string" 
        ? "Unknown Teacher" 
        : (newAssignment.data.teacherId as any).userId?.name || "Unknown Teacher";
      const className = typeof newAssignment.data.classId === "string" 
        ? "Unknown Class" 
        : (newAssignment.data.classId as any).name || "Unknown Class";

      toast.success(`Successfully assigned ${teacherName} to ${className}`);
      form.reset();
      setOpen(false);
    } catch (error: any) {
      console.error("Create assignment failed:", error);
      toast.error(error?.data?.message || "Failed to create assignment");
    }
  }

  const getTeacherName = (teacher: any) => {
    if (typeof teacher.userId === "string") return "Unknown";
    return (teacher.userId as any).name || "Unknown";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`gap-2 ${triggerClassName ?? ""}`}>
          <UserPlus className="h-4 w-4" />
          Assign Class
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Teacher to Class</DialogTitle>
          <DialogDescription>
            Assign a teacher to a class. Note: This will end any current assignments for the selected teacher.
          </DialogDescription>
        </DialogHeader>

        <form id="assign-class-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="teacherId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Teacher *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachersData?.data.map((teacher) => (
                        <SelectItem key={teacher._id} value={teacher._id}>
                          {getTeacherName(teacher)}
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
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Class *</FieldLabel>
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
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="assignment-notes">Notes (optional)</FieldLabel>
                  <Input
                    {...field}
                    id="assignment-notes"
                    placeholder="Add any notes about this assignment"
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
            form="assign-class-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Assigning..." : "Assign Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

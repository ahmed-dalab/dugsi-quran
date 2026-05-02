import { History } from "lucide-react";
import { useState } from "react";
import { useGetAssignmentsByTeacherQuery } from "../api/assignmentApi";
import type { TeacherClassAssignment } from "../types/assignment.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AssignmentHistoryProps {
  teacherId: string;
  teacherName: string;
}

interface AssignmentHistoryContentProps {
  teacherId: string;
}

export function AssignmentHistoryContent({ teacherId }: AssignmentHistoryContentProps) {
  const { data: assignmentsData, isLoading } = useGetAssignmentsByTeacherQuery(teacherId, {
    skip: !teacherId,
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      ended: "secondary",
      inactive: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  const getClassName = (classId: TeacherClassAssignment["classId"]) => {
    if (typeof classId === "string") return "Unknown Class";
    return (classId as any).name || "Unknown Class";
  };

  const getAssignedByName = (assignedBy: TeacherClassAssignment["assignedBy"]) => {
    if (typeof assignedBy === "string") return "Unknown";
    return (assignedBy as any).name || "Unknown";
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div>Loading assignment history...</div>
      </div>
    );
  }

  if (!assignmentsData?.data || assignmentsData.data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No assignment history found for this teacher.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Assigned By</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignmentsData.data.map((assignment) => (
          <TableRow key={assignment._id}>
            <TableCell className="font-medium">
              {getClassName(assignment.classId)}
            </TableCell>
            <TableCell>
              {getStatusBadge(assignment.status)}
            </TableCell>
            <TableCell>
              {formatDate(assignment.assignedDate)}
            </TableCell>
            <TableCell>
              {formatDate(assignment.endDate)}
            </TableCell>
            <TableCell>
              {getAssignedByName(assignment.assignedBy)}
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate" title={assignment.notes || "-"}>
                {assignment.notes || "-"}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function AssignmentHistory({ teacherId, teacherName }: AssignmentHistoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          History
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assignment History - {teacherName}</DialogTitle>
          <DialogDescription>
            View the complete assignment history for this teacher, including current and past class assignments.
          </DialogDescription>
        </DialogHeader>

        {open ? <AssignmentHistoryContent teacherId={teacherId} /> : null}
      </DialogContent>
    </Dialog>
  );
}

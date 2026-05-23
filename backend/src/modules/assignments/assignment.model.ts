export type AssignmentStatus = "active" | "inactive" | "ended";

export interface ITeacherClassAssignment {
  teacherId: string;
  classId: string;
  status?: AssignmentStatus;
  assignedDate?: Date;
  endDate?: Date | null;
  assignedBy: string;
  notes?: string;
}

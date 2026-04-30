export type AssignmentStatus = "active" | "inactive" | "ended";

export interface AssignmentClass {
  _id: string;
  name: string;
  levelOrder?: number;
}

export interface AssignmentTeacher {
  _id: string;
  userId: string | {
    _id: string;
    name: string;
    email: string;
    role: "teacher";
    isActive: boolean;
  };
}

export interface AssignmentUser {
  _id: string;
  name: string;
  email: string;
}

export interface TeacherClassAssignment {
  _id: string;
  teacherId: string | AssignmentTeacher;
  classId: string | AssignmentClass;
  status: AssignmentStatus;
  assignedDate: string;
  endDate?: string | null;
  assignedBy: string | AssignmentUser;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

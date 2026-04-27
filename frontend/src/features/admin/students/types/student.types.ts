export type StudentGender = "male" | "female";
export type StudentStatus = "active" | "inactive";

export interface StudentClass {
  _id: string;
  name: string;
  levelOrder?: number;
}

export interface Student {
  _id: string;
  fullName: string;
  gender: StudentGender;
  dateOfBirth?: string | null;
  guardianName?: string | null;
  guardianPhone: string;
  classId: string | StudentClass;
  registrationDate: string;
  status: StudentStatus;
  createdAt?: string;
  updatedAt?: string;
}

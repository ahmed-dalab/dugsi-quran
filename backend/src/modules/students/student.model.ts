export type StudentGender = "male" | "female";
export type StudentStatus = "active" | "inactive";

export interface IStudent {
  fullName: string;
  gender: StudentGender;
  dateOfBirth?: Date | null;
  guardianName?: string;
  guardianPhone: string;
  classId: string;
  registrationDate?: Date;
  status?: StudentStatus;
}

export type TeacherGender = "male" | "female";
export type TeacherStatus = "active" | "inactive";
export type TeacherEmploymentType = "full-time" | "part-time" | "volunteer";

export interface ITeacher {
  userId?: string;
  employeeId?: string;
  phone?: string;
  address?: string;
  gender?: TeacherGender;
  dateOfBirth?: Date | null;
  hireDate?: Date;
  qualification?: string;
  specialization?: string;
  experience?: string;
  salary?: number;
  employmentType?: TeacherEmploymentType;
  status: TeacherStatus;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

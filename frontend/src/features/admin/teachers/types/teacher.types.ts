export type TeacherGender = "male" | "female";
export type TeacherStatus = "active" | "inactive";
export type TeacherEmploymentType = "full-time" | "part-time" | "volunteer";

export interface TeacherUser {
  _id: string;
  name: string;
  email: string;
  role: "teacher";
  isActive: boolean;
}

export interface EmergencyContact {
  name?: string;
  phone?: string;
  relationship?: string;
}

export interface Teacher {
  _id: string;
  userId: string | TeacherUser;
  employeeId?: string;
  phone?: string;
  address?: string;
  gender?: TeacherGender;
  dateOfBirth?: string | null;
  hireDate?: string;
  qualification?: string;
  specialization?: string;
  experience?: string;
  salary?: number;
  employmentType?: TeacherEmploymentType;
  status: TeacherStatus;
  emergencyContact?: EmergencyContact;
  createdAt?: string;
  updatedAt?: string;
}

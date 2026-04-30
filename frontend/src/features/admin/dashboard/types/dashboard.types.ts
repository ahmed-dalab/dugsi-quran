export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeAssignments: number;
  recentRegistrations: number;
  studentsByGender: {
    male: number;
    female: number;
  };
  teachersByEmploymentType: {
    "full-time": number;
    "part-time": number;
    "volunteer": number;
  };
  assignmentsByStatus: {
    active: number;
    ended: number;
    inactive: number;
  };
  monthlyRegistrations: {
    month: string;
    students: number;
    teachers: number;
  }[];
  classDistribution: {
    className: string;
    studentCount: number;
  }[];
}

export interface DashboardResponse {
  message: string;
  data: DashboardStats;
}

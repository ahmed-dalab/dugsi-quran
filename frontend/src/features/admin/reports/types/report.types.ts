export interface ReportsOverview {
  generatedAt: string;
  summary: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    totalTeachers: number;
    totalClasses: number;
    activeAssignments: number;
  };
  fees: {
    month: string;
    totalDue: number;
    totalCollected: number;
    outstanding: number;
    collectionRate: number;
    byStatus: {
      paid: number;
      partial: number;
      unpaid: number;
    };
  };
  attendance: {
    sessionsLast30Days: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };
  monthlyCollections: {
    month: string;
    amount: number;
  }[];
  classStudentBreakdown: {
    className: string;
    studentCount: number;
  }[];
}

export interface ReportsOverviewResponse {
  message: string;
  data: ReportsOverview;
}

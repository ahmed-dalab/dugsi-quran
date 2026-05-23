import { dashboardRepository } from "./dashboard.repository";

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeAssignments: number;
  recentRegistrations: number;
  studentsByGender: { male: number; female: number };
  assignmentsByStatus: { active: number; ended: number; inactive: number };
  monthlyRegistrations: { month: string; students: number; teachers: number }[];
  classDistribution: { className: string; studentCount: number }[];
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getDashboardStatsService = async (): Promise<DashboardStats> => {
  const data = await dashboardRepository.getStats();

  const genderStats = { male: 0, female: 0 };
  data.studentsByGender.forEach((item) => {
    if (item.gender === "male" || item.gender === "female") {
      genderStats[item.gender] = item._count._all;
    }
  });

  const assignmentStats = { active: 0, ended: 0, inactive: 0 };
  data.assignmentsByStatus.forEach((item) => {
    if (item.status === "active" || item.status === "ended" || item.status === "inactive") {
      assignmentStats[item.status] = item._count._all;
    }
  });

  const monthlyRegistrations: { month: string; students: number; teachers: number }[] = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const studentData = data.monthlyStudentRegistrations.find(
      (item) => Number(item.year) === year && Number(item.month) === month
    );
    const teacherData = data.monthlyTeacherRegistrations.find(
      (item) => Number(item.year) === year && Number(item.month) === month
    );

    monthlyRegistrations.push({
      month: monthNames[date.getMonth()],
      students: Number(studentData?.count ?? 0),
      teachers: Number(teacherData?.count ?? 0),
    });
  }

  const classNameById = new Map(data.classes.map((classItem) => [classItem.id, classItem.name]));

  const classDistribution = data.classGroups
    .map((group) => ({
      className: classNameById.get(group.classId) ?? "Unknown",
      studentCount: group._count._all,
    }))
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 10);

  return {
    totalUsers: data.totalUsers,
    totalStudents: data.totalStudents,
    totalTeachers: data.totalTeachers,
    totalClasses: data.totalClasses,
    activeAssignments: data.activeAssignments,
    recentRegistrations: data.recentRegistrations,
    studentsByGender: genderStats,
    assignmentsByStatus: assignmentStats,
    monthlyRegistrations,
    classDistribution,
  };
};

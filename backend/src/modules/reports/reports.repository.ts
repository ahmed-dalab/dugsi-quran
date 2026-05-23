import { prisma } from "../../config/prisma";
import { attendanceRepository } from "../attendance/attendance.repository";
import { assignmentRepository } from "../assignments/assignment.repository";
import { classRepository } from "../classes/class.repository";
import { feeRepository } from "../fees/fee.repository";
import { studentRepository } from "../students/student.repository";
import { teacherRepository } from "../teachers/teacher.repository";

export const reportsRepository = {
  async getOverview(month: number, year: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString().slice(0, 10);

    const [
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalTeachers,
      totalClasses,
      activeAssignments,
      monthlyFeeTotals,
      feeStatusCounts,
      attendanceStats,
      sixMonthsCollections,
      classGroups,
      classes,
    ] = await Promise.all([
      studentRepository.count(),
      studentRepository.count({ status: "active" }),
      studentRepository.count({ status: "inactive" }),
      teacherRepository.count(),
      classRepository.count(),
      assignmentRepository.count({ status: "active" }),
      feeRepository.monthlyTotals(month, year),
      feeRepository.countByStatus(month, year),
      attendanceRepository.attendanceStatsSince(thirtyDaysAgoIso),
      feeRepository.collectionsSinceYear(year),
      studentRepository.groupByClass("active"),
      prisma.class.findMany({ select: { id: true, name: true } }),
    ]);

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalTeachers,
      totalClasses,
      activeAssignments,
      monthlyFeeTotals,
      feeStatusCounts,
      attendanceStats,
      sixMonthsCollections,
      classGroups,
      classes,
    };
  },
};

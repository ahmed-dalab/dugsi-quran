import { prisma } from "../../config/prisma";
import { assignmentRepository } from "../assignments/assignment.repository";
import { classRepository } from "../classes/class.repository";
import { studentRepository } from "../students/student.repository";
import { teacherRepository } from "../teachers/teacher.repository";
import { userRepository } from "../users/user.repository";

export const dashboardRepository = {
  async getStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalClasses,
      activeAssignments,
      recentStudentRegistrations,
      recentTeacherRegistrations,
      studentsByGender,
      assignmentsByStatus,
      monthlyStudentRegistrations,
      monthlyTeacherRegistrations,
      classGroups,
      classes,
    ] = await Promise.all([
      userRepository.count(),
      studentRepository.count({ status: "active" }),
      teacherRepository.count(),
      classRepository.count(),
      assignmentRepository.count({ status: "active" }),
      studentRepository.countRegistrationsSince(thirtyDaysAgo),
      teacherRepository.countCreatedSince(thirtyDaysAgo),
      studentRepository.groupByGender("active"),
      assignmentRepository.groupByStatus(),
      studentRepository.registrationsByMonthSince(sixMonthsAgo),
      teacherRepository.registrationsByMonthSince(sixMonthsAgo),
      studentRepository.groupByClass("active"),
      prisma.class.findMany({ select: { id: true, name: true } }),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalClasses,
      activeAssignments,
      recentRegistrations: recentStudentRegistrations + recentTeacherRegistrations,
      studentsByGender,
      assignmentsByStatus,
      monthlyStudentRegistrations,
      monthlyTeacherRegistrations,
      classGroups,
      classes,
    };
  },
};

import { User } from "../users/user.model";
import { StudentModel } from "../students/student.model";
import { TeacherModel } from "../teachers/teacher.model";
import { AssignmentModel } from "../assignments/assignment.model";
import { ClassModel } from "../classes/class.model";

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeAssignments: number;
  recentRegistrations: number;
  studentsByGender: { male: number; female: number };
  teachersByEmploymentType: { "full-time": number; "part-time": number; "volunteer": number };
  assignmentsByStatus: { active: number; ended: number; inactive: number };
  monthlyRegistrations: { month: string; students: number; teachers: number }[];
  classDistribution: { className: string; studentCount: number }[];
}

export const getDashboardStatsService = async (): Promise<DashboardStats> => {
  // Get basic counts
  const totalUsers = await User.countDocuments();
  const totalStudents = await StudentModel.countDocuments({ status: "active" });
  const totalTeachers = await TeacherModel.countDocuments();
  const totalClasses = await ClassModel.countDocuments();
  const activeAssignments = await AssignmentModel.countDocuments({ status: "active" });

  // Get recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentStudentRegistrations = await StudentModel.countDocuments({
    registrationDate: { $gte: thirtyDaysAgo }
  });
  
  const recentTeacherRegistrations = await TeacherModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  const recentRegistrations = recentStudentRegistrations + recentTeacherRegistrations;

  // Get students by gender
  const studentsByGender = await StudentModel.aggregate([
    { $match: { status: "active" } },
    { $group: { _id: "$gender", count: { $sum: 1 } } }
  ]);
  
  const genderStats = { male: 0, female: 0 };
  studentsByGender.forEach(item => {
    if (item._id) {
      genderStats[item._id as keyof typeof genderStats] = item.count;
    }
  });

  // Get teachers by employment type
  const teachersByEmployment = await TeacherModel.aggregate([
    { $group: { _id: "$employmentType", count: { $sum: 1 } } }
  ]);
  
  const employmentStats = { "full-time": 0, "part-time": 0, "volunteer": 0 };
  teachersByEmployment.forEach(item => {
    if (item._id) {
      employmentStats[item._id as keyof typeof employmentStats] = item.count;
    }
  });

  // Get assignments by status
  const assignmentsByStatus = await AssignmentModel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  
  const assignmentStats = { active: 0, ended: 0, inactive: 0 };
  assignmentsByStatus.forEach(item => {
    if (item._id) {
      assignmentStats[item._id as keyof typeof assignmentStats] = item.count;
    }
  });

  // Get monthly registrations for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyStudentRegistrations = await StudentModel.aggregate([
    { $match: { registrationDate: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$registrationDate" },
          month: { $month: "$registrationDate" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const monthlyTeacherRegistrations = await TeacherModel.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  // Combine monthly data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRegistrations: { month: string; students: number; teachers: number }[] = [];
  
  // Create entries for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const studentData = monthlyStudentRegistrations.find(
      item => item._id.year === year && item._id.month === month + 1
    );
    
    const teacherData = monthlyTeacherRegistrations.find(
      item => item._id.year === year && item._id.month === month + 1
    );
    
    monthlyRegistrations.push({
      month: monthNames[month],
      students: studentData?.count || 0,
      teachers: teacherData?.count || 0
    });
  }

  // Get class distribution (students per class)
  const classDistribution = await StudentModel.aggregate([
    { $match: { status: "active" } },
    {
      $group: {
        _id: "$classId",
        studentCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "_id",
        as: "classInfo"
      }
    },
    { $unwind: "$classInfo" },
    {
      $project: {
        className: "$classInfo.name",
        studentCount: 1
      }
    },
    { $sort: { studentCount: -1 } },
    { $limit: 10 }
  ]);

  return {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalClasses,
    activeAssignments,
    recentRegistrations,
    studentsByGender: genderStats,
    teachersByEmploymentType: employmentStats,
    assignmentsByStatus: assignmentStats,
    monthlyRegistrations,
    classDistribution: classDistribution.map(item => ({
      className: item.className,
      studentCount: item.studentCount
    }))
  };
};

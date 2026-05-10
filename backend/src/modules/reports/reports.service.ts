import { AssignmentModel } from "../assignments/assignment.model";
import { AttendanceModel } from "../attendance/attendance.model";
import { ClassModel } from "../classes/class.model";
import { FeePaymentModel } from "../fees/fee.model";
import { StudentModel } from "../students/student.model";
import { TeacherModel } from "../teachers/teacher.model";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

export const getReportsOverviewService = async (): Promise<ReportsOverview> => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [
    totalStudents,
    activeStudents,
    inactiveStudents,
    totalTeachers,
    totalClasses,
    activeAssignments,
  ] = await Promise.all([
    StudentModel.countDocuments(),
    StudentModel.countDocuments({ status: "active" }),
    StudentModel.countDocuments({ status: "inactive" }),
    TeacherModel.countDocuments(),
    ClassModel.countDocuments(),
    AssignmentModel.countDocuments({ status: "active" }),
  ]);

  const monthlyFeeTotals = await FeePaymentModel.aggregate([
    { $match: { month, year } },
    {
      $group: {
        _id: null,
        totalDue: { $sum: "$amountDue" },
        totalCollected: { $sum: "$amountPaid" },
      },
    },
  ]);

  const feeStatusCounts = await FeePaymentModel.aggregate([
    { $match: { month, year } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const feeByStatus = { paid: 0, partial: 0, unpaid: 0 };
  feeStatusCounts.forEach((entry) => {
    if (entry._id && entry._id in feeByStatus) {
      feeByStatus[entry._id as keyof typeof feeByStatus] = entry.count as number;
    }
  });

  const monthlyTotals = monthlyFeeTotals[0] ?? { totalDue: 0, totalCollected: 0 };
  const outstanding = Math.max(0, Number(monthlyTotals.totalDue) - Number(monthlyTotals.totalCollected));
  const collectionRate = Number(monthlyTotals.totalDue)
    ? roundToTwo((Number(monthlyTotals.totalCollected) / Number(monthlyTotals.totalDue)) * 100)
    : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString().slice(0, 10);

  const attendanceAggregation = await AttendanceModel.aggregate([
    { $match: { date: { $gte: thirtyDaysAgoIso } } },
    {
      $facet: {
        sessions: [{ $count: "total" }],
        statuses: [
          { $unwind: "$records" },
          { $group: { _id: "$records.status", count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  const attendanceData = attendanceAggregation[0] ?? { sessions: [], statuses: [] };
  const sessionsLast30Days = Number(attendanceData.sessions?.[0]?.total ?? 0);

  const attendanceCounts = { present: 0, absent: 0, late: 0, excused: 0 };
  (attendanceData.statuses ?? []).forEach((entry: { _id?: string; count: number }) => {
    if (entry._id && entry._id in attendanceCounts) {
      attendanceCounts[entry._id as keyof typeof attendanceCounts] = entry.count;
    }
  });

  const attendanceTotalRecords =
    attendanceCounts.present +
    attendanceCounts.absent +
    attendanceCounts.late +
    attendanceCounts.excused;

  const attendanceRate = attendanceTotalRecords
    ? roundToTwo(((attendanceCounts.present + attendanceCounts.late) / attendanceTotalRecords) * 100)
    : 0;

  const sixMonthsCollectionsAgg = await FeePaymentModel.aggregate([
    {
      $match: {
        year: { $gte: year - 1 },
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        amount: { $sum: "$amountPaid" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyCollections: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + 1;

    const found = sixMonthsCollectionsAgg.find(
      (entry) => entry._id.year === targetYear && entry._id.month === targetMonth
    );

    monthlyCollections.push({
      month: `${monthNames[targetMonth - 1]} ${String(targetYear).slice(-2)}`,
      amount: Number(found?.amount ?? 0),
    });
  }

  const classStudentBreakdownAgg = await StudentModel.aggregate([
    { $match: { status: "active" } },
    {
      $group: {
        _id: "$classId",
        studentCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "_id",
        as: "classInfo",
      },
    },
    { $unwind: "$classInfo" },
    {
      $project: {
        _id: 0,
        className: "$classInfo.name",
        studentCount: 1,
      },
    },
    { $sort: { studentCount: -1, className: 1 } },
  ]);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalTeachers,
      totalClasses,
      activeAssignments,
    },
    fees: {
      month: `${monthNames[month - 1]} ${year}`,
      totalDue: Number(monthlyTotals.totalDue ?? 0),
      totalCollected: Number(monthlyTotals.totalCollected ?? 0),
      outstanding,
      collectionRate,
      byStatus: feeByStatus,
    },
    attendance: {
      sessionsLast30Days,
      present: attendanceCounts.present,
      absent: attendanceCounts.absent,
      late: attendanceCounts.late,
      excused: attendanceCounts.excused,
      attendanceRate,
    },
    monthlyCollections,
    classStudentBreakdown: classStudentBreakdownAgg.map((entry) => ({
      className: String(entry.className),
      studentCount: Number(entry.studentCount),
    })),
  };
};

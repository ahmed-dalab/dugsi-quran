import { reportsRepository } from "./reports.repository";

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

  const data = await reportsRepository.getOverview(month, year);

  const feeByStatus = { paid: 0, partial: 0, unpaid: 0 };
  data.feeStatusCounts.forEach((entry) => {
    if (entry.status in feeByStatus) {
      feeByStatus[entry.status as keyof typeof feeByStatus] = entry._count._all;
    }
  });

  const totalDue = Number(data.monthlyFeeTotals._sum.amountDue ?? 0);
  const totalCollected = Number(data.monthlyFeeTotals._sum.amountPaid ?? 0);
  const outstanding = Math.max(0, totalDue - totalCollected);
  const collectionRate = totalDue ? roundToTwo((totalCollected / totalDue) * 100) : 0;

  const attendanceRow = data.attendanceStats[0];
  const sessionsLast30Days = Number(attendanceRow?.sessions ?? 0);
  const attendanceCounts = {
    present: Number(attendanceRow?.present ?? 0),
    absent: Number(attendanceRow?.absent ?? 0),
    late: Number(attendanceRow?.late ?? 0),
    excused: Number(attendanceRow?.excused ?? 0),
  };

  const attendanceTotalRecords =
    attendanceCounts.present +
    attendanceCounts.absent +
    attendanceCounts.late +
    attendanceCounts.excused;

  const attendanceRate = attendanceTotalRecords
    ? roundToTwo(((attendanceCounts.present + attendanceCounts.late) / attendanceTotalRecords) * 100)
    : 0;

  const monthlyCollections: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + 1;

    const found = data.sixMonthsCollections.find(
      (entry) => entry.year === targetYear && entry.month === targetMonth
    );

    monthlyCollections.push({
      month: `${monthNames[targetMonth - 1]} ${String(targetYear).slice(-2)}`,
      amount: Number(found?._sum.amountPaid ?? 0),
    });
  }

  const classNameById = new Map(data.classes.map((classItem) => [classItem.id, classItem.name]));

  const classStudentBreakdown = data.classGroups
    .map((group) => ({
      className: classNameById.get(group.classId) ?? "Unknown",
      studentCount: group._count._all,
    }))
    .sort((a, b) => b.studentCount - a.studentCount || a.className.localeCompare(b.className));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalStudents: data.totalStudents,
      activeStudents: data.activeStudents,
      inactiveStudents: data.inactiveStudents,
      totalTeachers: data.totalTeachers,
      totalClasses: data.totalClasses,
      activeAssignments: data.activeAssignments,
    },
    fees: {
      month: `${monthNames[month - 1]} ${year}`,
      totalDue,
      totalCollected,
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
    classStudentBreakdown,
  };
};

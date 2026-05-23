import type { AttendanceStatus, Prisma } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";
import { buildPaginationMeta, getPrismaPaginationArgs } from "../../utils/prismaPagination";

const attendanceInclude = {
  class: { select: { id: true, name: true, levelOrder: true } },
  takenBy: { select: { id: true, name: true, email: true } },
  records: {
    include: {
      student: { select: { id: true, fullName: true, classId: true } },
    },
  },
};

const historyInclude = {
  takenBy: { select: { id: true, name: true, email: true } },
};

export const attendanceRepository = {
  upsertWithRecords(input: {
    classId: string;
    date: string;
    takenById: string;
    records: { studentId: string; status: AttendanceStatus; note?: string }[];
  }) {
    const { classId, date, takenById, records } = input;

    return prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.upsert({
        where: { classId_date: { classId, date } },
        create: { classId, date, takenById },
        update: { takenById },
      });

      await tx.attendanceRecord.deleteMany({ where: { attendanceId: attendance.id } });

      if (records.length > 0) {
        await tx.attendanceRecord.createMany({
          data: records.map((record) => ({
            attendanceId: attendance.id,
            studentId: record.studentId,
            status: record.status,
            note: record.note,
          })),
        });
      }

      return tx.attendance.findUnique({
        where: { id: attendance.id },
        include: attendanceInclude,
      });
    });
  },

  findByClassAndDate(classId: string, date: string) {
    return prisma.attendance.findUnique({
      where: { classId_date: { classId, date } },
      include: attendanceInclude,
    });
  },

  async findHistoryByClass(classId: string, pagination: PaginationQuery, filters: { fromDate?: string; toDate?: string }) {
    const where: Prisma.AttendanceWhereInput = {
      classId,
      ...buildPrismaOrSearch(pagination.search, ["date"]),
      ...(filters.fromDate || filters.toDate
        ? {
            date: {
              ...(filters.fromDate ? { gte: filters.fromDate } : {}),
              ...(filters.toDate ? { lte: filters.toDate } : {}),
            },
          }
        : {}),
    };

    const [docs, totalDocs] = await Promise.all([
      prisma.attendance.findMany({
        where,
        ...getPrismaPaginationArgs(pagination),
        orderBy: { date: pagination.sortOrder },
        include: historyInclude,
      }),
      prisma.attendance.count({ where }),
    ]);

    return { docs, pagination: buildPaginationMeta(totalDocs, pagination) };
  },

  attendanceStatsSince(dateIso: string) {
    return prisma.$queryRaw<
      { sessions: bigint; present: bigint; absent: bigint; late: bigint; excused: bigint }[]
    >`
      SELECT
        COUNT(DISTINCT a.id)::bigint AS sessions,
        COUNT(*) FILTER (WHERE ar.status = 'present')::bigint AS present,
        COUNT(*) FILTER (WHERE ar.status = 'absent')::bigint AS absent,
        COUNT(*) FILTER (WHERE ar.status = 'late')::bigint AS late,
        COUNT(*) FILTER (WHERE ar.status = 'excused')::bigint AS excused
      FROM attendances a
      LEFT JOIN attendance_records ar ON ar.attendance_id = a.id
      WHERE a.date >= ${dateIso}
    `;
  },
};

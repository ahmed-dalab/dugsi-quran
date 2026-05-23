import type { Prisma, StudentGender, StudentStatus } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";
import { buildPaginationMeta, getPrismaPaginationArgs } from "../../utils/prismaPagination";

const classSelect = { id: true, name: true, levelOrder: true };

export const studentRepository = {
  create(data: Prisma.StudentCreateInput) {
    return prisma.student.create({
      data,
      include: { class: { select: classSelect } },
    });
  },

  async findPaginated(
    pagination: PaginationQuery,
    filters: { classId?: string; status?: StudentStatus; gender?: StudentGender }
  ) {
    const where: Prisma.StudentWhereInput = {
      ...buildPrismaOrSearch(pagination.search, ["fullName", "guardianName", "guardianPhone"]),
      ...(filters.classId ? { classId: filters.classId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.gender ? { gender: filters.gender } : {}),
    };

    const orderBy = { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder } as Prisma.StudentOrderByWithRelationInput;

    const [docs, totalDocs] = await Promise.all([
      prisma.student.findMany({
        where,
        ...getPrismaPaginationArgs(pagination),
        orderBy,
        include: { class: { select: classSelect } },
      }),
      prisma.student.count({ where }),
    ]);

    return { docs, pagination: buildPaginationMeta(totalDocs, pagination) };
  },

  findById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: { class: { select: classSelect } },
    });
  },

  update(id: string, data: Prisma.StudentUpdateInput) {
    return prisma.student.update({
      where: { id },
      data,
      include: { class: { select: classSelect } },
    });
  },

  delete(id: string) {
    return prisma.student.delete({ where: { id } });
  },

  findActiveIdsByClass(classId: string) {
    return prisma.student.findMany({
      where: { classId, status: "active" },
      select: { id: true },
    });
  },

  count(where?: Prisma.StudentWhereInput) {
    return prisma.student.count({ where });
  },

  groupByGender(status: StudentStatus) {
    return prisma.student.groupBy({
      by: ["gender"],
      where: { status },
      _count: { _all: true },
    });
  },

  groupByClass(status: StudentStatus) {
    return prisma.student.groupBy({
      by: ["classId"],
      where: { status },
      _count: { _all: true },
    });
  },

  countRegistrationsSince(since: Date) {
    return prisma.student.count({
      where: { registrationDate: { gte: since } },
    });
  },

  registrationsByMonthSince(since: Date) {
    return prisma.$queryRaw<{ year: number; month: number; count: bigint }[]>`
      SELECT
        EXTRACT(YEAR FROM registration_date)::int AS year,
        EXTRACT(MONTH FROM registration_date)::int AS month,
        COUNT(*)::bigint AS count
      FROM students
      WHERE registration_date >= ${since}
      GROUP BY 1, 2
      ORDER BY 1, 2
    `;
  },
};

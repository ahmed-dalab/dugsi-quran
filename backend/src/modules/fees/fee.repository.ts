import type { FeePaymentStatus, Prisma } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";
import { buildPaginationMeta, getPrismaPaginationArgs } from "../../utils/prismaPagination";

const feeInclude = {
  student: { select: { id: true, fullName: true } },
  class: { select: { id: true, name: true, levelOrder: true } },
  receivedBy: { select: { id: true, name: true } },
};

export const feeRepository = {
  create(data: Prisma.FeePaymentCreateInput) {
    return prisma.feePayment.create({
      data,
      include: feeInclude,
    });
  },

  async findPaginated(
    pagination: PaginationQuery,
    filters: {
      status?: FeePaymentStatus;
      classId?: string;
      studentId?: string;
      month?: number;
      year?: number;
    }
  ) {
    const where: Prisma.FeePaymentWhereInput = {
      ...buildPrismaOrSearch(pagination.search, ["note", "status"]),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.classId ? { classId: filters.classId } : {}),
      ...(filters.studentId ? { studentId: filters.studentId } : {}),
      ...(filters.month ? { month: filters.month } : {}),
      ...(filters.year ? { year: filters.year } : {}),
    };

    const [docs, totalDocs] = await Promise.all([
      prisma.feePayment.findMany({
        where,
        ...getPrismaPaginationArgs(pagination),
        orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
        include: feeInclude,
      }),
      prisma.feePayment.count({ where }),
    ]);

    return { docs, pagination: buildPaginationMeta(totalDocs, pagination) };
  },

  findById(id: string) {
    return prisma.feePayment.findUnique({
      where: { id },
      include: feeInclude,
    });
  },

  update(id: string, data: Prisma.FeePaymentUpdateInput) {
    return prisma.feePayment.update({
      where: { id },
      data,
      include: feeInclude,
    });
  },

  delete(id: string) {
    return prisma.feePayment.delete({
      where: { id },
      include: feeInclude,
    });
  },

  monthlyTotals(month: number, year: number) {
    return prisma.feePayment.aggregate({
      where: { month, year },
      _sum: { amountDue: true, amountPaid: true },
    });
  },

  countByStatus(month: number, year: number) {
    return prisma.feePayment.groupBy({
      by: ["status"],
      where: { month, year },
      _count: { _all: true },
    });
  },

  collectionsSinceYear(year: number) {
    return prisma.feePayment.groupBy({
      by: ["year", "month"],
      where: { year: { gte: year - 1 } },
      _sum: { amountPaid: true },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });
  },
};

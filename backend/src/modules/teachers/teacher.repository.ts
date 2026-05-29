import type { EmploymentType, Prisma, TeacherStatus } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { paginateQuery } from "../../utils/prismaRepository";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";
import { mapEmergencyContactToDb } from "../../utils/mappers";

const userSelect = { id: true, name: true, email: true, role: true, isActive: true };

const teacherInclude = { user: { select: userSelect } };

export const teacherRepository = {
  async createWithUser(input: {
    user: { name: string; email: string; password: string };
    teacher: Omit<Prisma.TeacherCreateWithoutUserInput, "emergencyContactName" | "emergencyContactPhone" | "emergencyContactRelationship"> & {
      emergencyContact?: { name?: string; phone?: string; relationship?: string };
    };
  }) {
    const { emergencyContact, ...teacherData } = input.teacher;

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.user.name,
          email: input.user.email,
          password: input.user.password,
          role: "teacher",
          isActive: true,
        },
      });

      return tx.teacher.create({
        data: {
          ...teacherData,
          ...mapEmergencyContactToDb(emergencyContact),
          userId: user.id,
        },
        include: teacherInclude,
      });
    });
  },

  async findPaginated(
    pagination: PaginationQuery,
    filters: { status?: TeacherStatus; employmentType?: EmploymentType }
  ) {
    let userIds: string[] | undefined;

    if (pagination.search) {
      const matchingUsers = await prisma.user.findMany({
        where: buildPrismaOrSearch(pagination.search, ["name", "email"]),
        select: { id: true },
      });
      userIds = matchingUsers.map((user) => user.id);
    }

    const teacherSearch = buildPrismaOrSearch(pagination.search, [
      "phone",
      "employeeId",
      "qualification",
      "specialization",
      "experience",
      "emergencyContactName",
      "emergencyContactPhone",
    ]);

    const where: Prisma.TeacherWhereInput = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.employmentType ? { employmentType: filters.employmentType } : {}),
      ...(pagination.search
        ? {
            OR: [
              ...(teacherSearch?.OR ?? []),
              ...(userIds && userIds.length > 0 ? [{ userId: { in: userIds } }] : []),
            ],
          }
        : {}),
    };

    const orderBy = { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder } as Prisma.TeacherOrderByWithRelationInput;

    return paginateQuery({
      findMany: ({ skip, take }) =>
        prisma.teacher.findMany({
          where,
          skip,
          take,
          orderBy,
          include: teacherInclude,
        }),
      count: () => prisma.teacher.count({ where }),
      pagination,
    });
  },

  findById(id: string) {
    return prisma.teacher.findUnique({
      where: { id },
      include: teacherInclude,
    });
  },

  async updateWithUser(
    id: string,
    teacherData: Prisma.TeacherUpdateInput & {
      emergencyContact?: { name?: string; phone?: string; relationship?: string };
    },
    userData?: { name?: string; email?: string; password?: string }
  ) {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return null;
    }

    const { emergencyContact, ...rest } = teacherData;

    if (userData && Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: teacher.userId },
        data: userData,
      });
    }

    return prisma.teacher.update({
      where: { id },
      data: {
        ...rest,
        ...(emergencyContact ? mapEmergencyContactToDb(emergencyContact) : {}),
      },
      include: teacherInclude,
    });
  },

  async deleteWithUser(id: string) {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return null;
    }

    return prisma.$transaction(async (tx) => {
      const deleted = await tx.teacher.delete({
        where: { id },
        include: teacherInclude,
      });
      await tx.user.delete({ where: { id: teacher.userId } });
      return deleted;
    });
  },

  count(where?: Prisma.TeacherWhereInput) {
    return prisma.teacher.count({ where });
  },

  countCreatedSince(since: Date) {
    return prisma.teacher.count({ where: { createdAt: { gte: since } } });
  },

  registrationsByMonthSince(since: Date) {
    return prisma.$queryRaw<{ year: number; month: number; count: bigint }[]>`
      SELECT
        EXTRACT(YEAR FROM created_at)::int AS year,
        EXTRACT(MONTH FROM created_at)::int AS month,
        COUNT(*)::bigint AS count
      FROM teachers
      WHERE created_at >= ${since}
      GROUP BY 1, 2
      ORDER BY 1, 2
    `;
  },
};

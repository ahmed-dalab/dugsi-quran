import type { AssignmentStatus, Prisma } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";
import { buildPaginationMeta, getPrismaPaginationArgs } from "../../utils/prismaPagination";

const teacherInclude = {
  teacher: {
    select: {
      id: true,
      userId: true,
      user: { select: { id: true, name: true, email: true, role: true, isActive: true } },
    },
  },
  class: { select: { id: true, name: true, levelOrder: true } },
  assignedBy: { select: { id: true, name: true, email: true } },
};

const teacherIncludeMinimal = {
  class: { select: { id: true, name: true, levelOrder: true } },
  assignedBy: { select: { id: true, name: true, email: true } },
};

const classIncludeMinimal = {
  teacher: {
    select: {
      id: true,
      userId: true,
      user: { select: { id: true, name: true, email: true, role: true, isActive: true } },
    },
  },
  assignedBy: { select: { id: true, name: true, email: true } },
};

export const assignmentRepository = {
  findActiveByTeacherAndClass(teacherId: string, classId: string) {
    return prisma.teacherClassAssignment.findFirst({
      where: { teacherId, classId, status: "active" },
    });
  },

  endActiveForTeacher(teacherId: string, note?: string) {
    return prisma.teacherClassAssignment.updateMany({
      where: { teacherId, status: "active" },
      data: {
        status: "ended",
        endDate: new Date(),
        notes: note ? `Automatically ended due to new assignment: ${note}` : "Automatically ended due to new assignment",
      },
    });
  },

  create(data: Prisma.TeacherClassAssignmentCreateInput) {
    return prisma.teacherClassAssignment.create({
      data,
      include: teacherInclude,
    });
  },

  async findPaginated(pagination: PaginationQuery, filters: { status?: AssignmentStatus; teacherId?: string; classId?: string }) {
    const where: Prisma.TeacherClassAssignmentWhereInput = {
      ...buildPrismaOrSearch(pagination.search, ["notes", "status"]),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
      ...(filters.classId ? { classId: filters.classId } : {}),
    };

    const include =
      filters.teacherId && !filters.classId
        ? teacherIncludeMinimal
        : filters.classId && !filters.teacherId
          ? classIncludeMinimal
          : teacherInclude;

    const [docs, totalDocs] = await Promise.all([
      prisma.teacherClassAssignment.findMany({
        where,
        ...getPrismaPaginationArgs(pagination),
        orderBy: { assignedDate: pagination.sortOrder },
        include,
      }),
      prisma.teacherClassAssignment.count({ where }),
    ]);

    return { docs, pagination: buildPaginationMeta(totalDocs, pagination) };
  },

  findById(id: string) {
    return prisma.teacherClassAssignment.findUnique({
      where: { id },
      include: teacherInclude,
    });
  },

  findActiveForTeacher(teacherId: string) {
    return prisma.teacherClassAssignment.findFirst({
      where: { teacherId, status: "active" },
      include: {
        class: { select: { id: true, name: true, levelOrder: true } },
        assignedBy: { select: { id: true, name: true, email: true } },
      },
    });
  },

  update(id: string, data: Prisma.TeacherClassAssignmentUpdateInput) {
    return prisma.teacherClassAssignment.update({
      where: { id },
      data,
      include: teacherInclude,
    });
  },

  delete(id: string) {
    return prisma.teacherClassAssignment.delete({
      where: { id },
      include: teacherInclude,
    });
  },

  count(where?: Prisma.TeacherClassAssignmentWhereInput) {
    return prisma.teacherClassAssignment.count({ where });
  },

  groupByStatus() {
    return prisma.teacherClassAssignment.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
  },
};

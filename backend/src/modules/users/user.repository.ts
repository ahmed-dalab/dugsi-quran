import type { Prisma, UserRole } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";
import type { PaginationQuery } from "../../utils/pagination";
import { paginateQuery } from "../../utils/prismaRepository";
import { buildPrismaOrSearch } from "../../utils/prismaSearch";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async findPaginated(pagination: PaginationQuery, filters: { role?: UserRole; isActive?: boolean }) {
    const where: Prisma.UserWhereInput = {
      ...buildPrismaOrSearch(pagination.search, ["name", "email"]),
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.isActive !== undefined ? { isActive: filters.isActive } : {}),
    };

    const orderBy = {
      [pagination.sortBy ?? "createdAt"]: pagination.sortOrder,
    } as Prisma.UserOrderByWithRelationInput;

    return paginateQuery({
      findMany: ({ skip, take }) =>
        prisma.user.findMany({ where, skip, take, orderBy, select: userSelect }),
      count: () => prisma.user.count({ where }),
      pagination,
    });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  },

  findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
      select: userSelect,
    });
  },

  count() {
    return prisma.user.count();
  },
};

import type { Prisma } from "../../../generated/prisma";
import { prisma } from "../../config/prisma";

const defaultSettings: Prisma.SettingsCreateInput = {
  schoolName: "Dugsi Quran",
  schoolEmail: null,
  schoolPhone: null,
  schoolAddress: null,
  timezone: "Africa/Mogadishu",
  currency: "USD",
  attendanceEditWindowDays: 7,
  activeAcademicYear: "2026",
};

export const settingsRepository = {
  async getOrCreate() {
    const existing = await prisma.settings.findFirst();
    if (existing) {
      return existing;
    }

    return prisma.settings.create({ data: defaultSettings });
  },

  async update(payload: Prisma.SettingsUpdateInput) {
    const settings = await this.getOrCreate();
    return prisma.settings.update({
      where: { id: settings.id },
      data: payload,
    });
  },
};

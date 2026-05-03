import type { ISettings } from "./settings.model";
import { SettingsModel } from "./settings.model";

type UpdateSettingsPayload = Partial<ISettings>;

const sanitizeSettings = (settings: unknown) => {
  if (
    typeof settings === "object" &&
    settings !== null &&
    "toObject" in settings &&
    typeof settings.toObject === "function"
  ) {
    return settings.toObject() as Record<string, unknown>;
  }

  return settings as Record<string, unknown>;
};

const defaultSettings: ISettings = {
  schoolName: "Dugsi Quran",
  schoolEmail: null,
  schoolPhone: null,
  schoolAddress: null,
  timezone: "Africa/Mogadishu",
  currency: "USD",
  attendanceEditWindowDays: 7,
  activeAcademicYear: "2026",
};

const getOrCreateSettings = async () => {
  let settings = await SettingsModel.findOne();

  if (!settings) {
    settings = await SettingsModel.create(defaultSettings);
  }

  return settings;
};

export const getSettingsService = async () => {
  const settings = await getOrCreateSettings();
  return sanitizeSettings(settings);
};

export const updateSettingsService = async (payload: UpdateSettingsPayload) => {
  const settings = await getOrCreateSettings();

  Object.assign(settings, payload);
  await settings.save();

  return sanitizeSettings(settings);
};

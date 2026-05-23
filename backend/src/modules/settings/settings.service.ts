import { serializeEntity } from "../../utils/serialize";
import type { ISettings } from "./settings.model";
import { settingsRepository } from "./settings.repository";

type UpdateSettingsPayload = Partial<ISettings>;

export const getSettingsService = async () => {
  const settings = await settingsRepository.getOrCreate();
  return serializeEntity(settings);
};

export const updateSettingsService = async (payload: UpdateSettingsPayload) => {
  const settings = await settingsRepository.update(payload);
  return serializeEntity(settings);
};

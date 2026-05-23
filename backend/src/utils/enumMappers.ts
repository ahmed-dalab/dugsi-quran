import type { EmploymentType } from "../../generated/prisma";

export const toEmploymentType = (value?: string): EmploymentType | undefined => {
  if (value === "full-time") return "full_time";
  if (value === "part-time") return "part_time";
  if (value === "volunteer") return "volunteer";
  return undefined;
};

export const fromEmploymentType = (value?: EmploymentType | null) => {
  if (value === "full_time") return "full-time";
  if (value === "part_time") return "part-time";
  if (value === "volunteer") return "volunteer";
  return value;
};

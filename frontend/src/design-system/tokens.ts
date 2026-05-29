/** Vibrant dashboard palette — distinct from app primary brand color */
export const dashboardChartPalette = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
  "#14b8a6", // teal
  "#84cc16", // lime
] as const;

export const dashboardChartColors = {
  students: "#6366f1",
  teachers: "#f59e0b",
  male: "#3b82f6",
  female: "#ec4899",
  active: "#22c55e",
  completed: "#6366f1",
  inactive: "#94a3b8",
} as const;

export function getDashboardChartColor(index: number) {
  return dashboardChartPalette[index % dashboardChartPalette.length];
}

/** @deprecated Use dashboardChartPalette for new dashboard charts */
export const chartColors = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  tertiary: "var(--chart-3)",
  quaternary: "var(--chart-4)",
  accent: "var(--chart-5)",
} as const;

/** @deprecated Use getDashboardChartColor for new dashboard charts */
export const chartPalette = [...dashboardChartPalette] as const;

/** @deprecated Use getDashboardChartColor for new dashboard charts */
export function getChartColor(index: number) {
  return getDashboardChartColor(index);
}

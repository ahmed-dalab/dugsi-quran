/** Chart series colors — align with CSS variables in index.css */
export const chartColors = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  tertiary: "var(--chart-3)",
  quaternary: "var(--chart-4)",
  accent: "var(--chart-5)",
} as const;

export const chartPalette = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.tertiary,
  chartColors.quaternary,
  chartColors.accent,
] as const;

export function getChartColor(index: number) {
  return chartPalette[index % chartPalette.length];
}

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { getDashboardChartColor } from "@/design-system/tokens";
import ChartCard from "./ChartCard";

export type PieChartDatum = {
  label: string;
  value: number;
  color?: string;
};

type DashboardPieChartProps = {
  title: string;
  subtitle?: string;
  data: PieChartDatum[];
  className?: string;
};

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: PieChartDatum }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{item.name}</p>
      <p className="text-muted-foreground">{item.value.toLocaleString()}</p>
    </div>
  );
}

export default function DashboardPieChart({
  title,
  subtitle,
  data,
  className,
}: DashboardPieChartProps) {
  const chartData = data.filter((item) => item.value > 0);
  const isEmpty = chartData.length === 0;

  return (
    <ChartCard title={title} subtitle={subtitle} className={className}>
      {isEmpty ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={96}
              paddingAngle={2}
              label={({ name, percent }) =>
                percent && percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
              }
              labelLine={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
            >
              {chartData.map((item, index) => (
                <Cell
                  key={item.label}
                  fill={item.color ?? getDashboardChartColor(index)}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboardChartColor } from "@/design-system/tokens";
import ChartCard from "./ChartCard";

type BarSeries = {
  key: string;
  name: string;
  color: string;
};

type DashboardBarChartProps = {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: BarSeries[];
  className?: string;
};

type CategoricalBarChartProps = {
  title: string;
  subtitle?: string;
  data: Array<{ label: string; value: number; color?: string }>;
  className?: string;
};

function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function DashboardGroupedBarChart({
  title,
  subtitle,
  data,
  xKey,
  series,
  className,
}: DashboardBarChartProps) {
  const isEmpty = data.every((row) => series.every((item) => Number(row[item.key] ?? 0) === 0));

  return (
    <ChartCard title={title} subtitle={subtitle} className={className}>
      {isEmpty ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          No data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey={xKey}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.35 }} />
            <Legend
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
            {series.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.name}
                fill={item.color}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

export function DashboardCategoricalBarChart({
  title,
  subtitle,
  data,
  className,
}: CategoricalBarChartProps) {
  const chartData = data.map((item) => ({ name: item.label, value: item.value, color: item.color }));
  const isEmpty = chartData.every((item) => item.value === 0);

  return (
    <ChartCard title={title} subtitle={subtitle} className={className}>
      {isEmpty ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          No data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<BarTooltip />}
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
            />
            <Bar dataKey="value" name="Students" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={item.color ?? getDashboardChartColor(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

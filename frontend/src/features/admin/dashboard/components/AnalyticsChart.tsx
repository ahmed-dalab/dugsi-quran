import { Card } from "@/components/ui/card";
import { chartColors } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  type?: "bar" | "horizontal";
  className?: string;
}

export default function AnalyticsChart({
  title,
  subtitle,
  data,
  type = "bar",
  className,
}: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-2.5">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>

        <div className="space-y-2.5">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.value}</span>
                  <span className="text-xs text-muted-foreground">
                    ({totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0}%)
                  </span>
                </div>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    type === "horizontal" && "rounded-r-none"
                  )}
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: item.color ?? chartColors.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total: {totalValue}</span>
            <span>{data.length} categories</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

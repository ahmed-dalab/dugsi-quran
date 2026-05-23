import { Card } from "@/components/ui/card";
import { getChartColor } from "@/design-system/tokens";

interface BarChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
}

export default function BarChart({ title, data }: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 truncate text-sm text-muted-foreground">{item.label}</div>
            <div className="mx-3 flex-1">
              <div className="h-6 w-full rounded-full bg-muted">
                <div
                  className="flex h-6 items-center justify-center rounded-full text-xs font-medium text-primary-foreground"
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: item.color ?? getChartColor(index),
                  }}
                >
                  {item.value > 0 && item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

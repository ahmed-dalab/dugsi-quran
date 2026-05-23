import { Card } from "@/components/ui/card";
import { chartColors } from "@/design-system/tokens";
import { cn } from "@/lib/utils";

interface TrendData {
  month: string;
  students: number;
  teachers: number;
}

interface TrendChartProps {
  title: string;
  subtitle?: string;
  data: TrendData[];
  className?: string;
}

export default function TrendChart({ title, subtitle, data, className }: TrendChartProps) {
  const maxValue = Math.max(...data.map((item) => Math.max(item.students, item.teachers)));

  const getBarHeight = (value: number) => (maxValue > 0 ? (value / maxValue) * 100 : 0);

  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: chartColors.primary }}
              />
              <span>Students</span>
            </div>
            <div className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: chartColors.secondary }}
              />
              <span>Teachers</span>
            </div>
          </div>

          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.month}
                </div>

                <div className="flex h-14 items-end space-x-1">
                  <div className="flex flex-1 items-end space-x-1">
                    <div
                      className="relative flex-1 rounded-t-sm transition-all duration-500 ease-out group"
                      style={{
                        height: `${getBarHeight(item.students)}%`,
                        backgroundColor: chartColors.primary,
                      }}
                    >
                      {item.students > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="rounded bg-foreground px-2 py-1 text-xs text-background">
                            {item.students}
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className="relative flex-1 rounded-t-sm transition-all duration-500 ease-out group"
                      style={{
                        height: `${getBarHeight(item.teachers)}%`,
                        backgroundColor: chartColors.secondary,
                      }}
                    >
                      {item.teachers > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="rounded bg-foreground px-2 py-1 text-xs text-background">
                            {item.teachers}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {data.reduce((sum, item) => sum + item.students, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {data.reduce((sum, item) => sum + item.teachers, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Teachers</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

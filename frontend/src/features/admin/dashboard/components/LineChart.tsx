import { Card } from "@/components/ui/card";
import { chartColors } from "@/design-system/tokens";

interface LineChartProps {
  title: string;
  data: Array<{
    month: string;
    students: number;
    teachers: number;
  }>;
}

export default function LineChart({ title, data }: LineChartProps) {
  const maxValue = Math.max(...data.map((item) => Math.max(item.students, item.teachers)));

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-sm">
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
              <div className="text-xs text-muted-foreground">{item.month}</div>
              <div className="flex space-x-2">
                <div className="relative h-4 flex-1 rounded-full bg-muted">
                  <div
                    className="h-4 rounded-full"
                    style={{
                      width: `${maxValue > 0 ? (item.students / maxValue) * 100 : 0}%`,
                      backgroundColor: chartColors.primary,
                    }}
                  />
                  {item.students > 0 && (
                    <span className="absolute right-2 top-0 text-xs leading-4 text-primary-foreground">
                      {item.students}
                    </span>
                  )}
                </div>
                <div className="relative h-4 flex-1 rounded-full bg-muted">
                  <div
                    className="h-4 rounded-full"
                    style={{
                      width: `${maxValue > 0 ? (item.teachers / maxValue) * 100 : 0}%`,
                      backgroundColor: chartColors.secondary,
                    }}
                  />
                  {item.teachers > 0 && (
                    <span className="absolute right-2 top-0 text-xs leading-4 text-primary-foreground">
                      {item.teachers}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

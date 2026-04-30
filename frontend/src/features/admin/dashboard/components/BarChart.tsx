import { Card } from "@/components/ui/card";

interface BarChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
}

export default function BarChart({ title, data }: BarChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-muted-foreground truncate">
              {item.label}
            </div>
            <div className="flex-1 mx-3">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-blue-500 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium"
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: item.color || '#3b82f6'
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

import { Card } from "@/components/ui/card";
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
  className 
}: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(item => item.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className={cn("p-6 border-0 bg-gradient-to-br from-white to-gray-50/30 shadow-sm", className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-semibold">{item.value}</span>
                  <span className="text-gray-500 text-xs">
                    ({totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    type === "horizontal" && "rounded-r-none"
                  )}
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                    backgroundColor: item.color || '#3b82f6'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total: {totalValue}</span>
            <span>{data.length} categories</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

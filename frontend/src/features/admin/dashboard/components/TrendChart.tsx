import { Card } from "@/components/ui/card";
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
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.students, item.teachers))
  );

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  };

  return (
    <Card className={cn("p-6 border-0 bg-gradient-to-br from-white to-gray-50/30 shadow-sm", className)}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Students</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Teachers</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                  {item.month}
                </div>
                
                <div className="flex items-end space-x-1 h-16">
                  <div className="flex-1 flex items-end space-x-1">
                    <div
                      className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-500 ease-out relative group"
                      style={{ height: `${getBarHeight(item.students)}%` }}
                    >
                      {item.students > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            {item.students}
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className="flex-1 bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out relative group"
                      style={{ height: `${getBarHeight(item.teachers)}%` }}
                    >
                      {item.teachers > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
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
        
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, item) => sum + item.students, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, item) => sum + item.teachers, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Teachers</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

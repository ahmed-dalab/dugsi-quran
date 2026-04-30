import { Card } from "@/components/ui/card";

interface LineChartProps {
  title: string;
  data: Array<{
    month: string;
    students: number;
    teachers: number;
  }>;
}

export default function LineChart({ title, data }: LineChartProps) {
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.students, item.teachers))
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Students</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Teachers</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="text-xs text-muted-foreground">{item.month}</div>
              <div className="flex space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{
                      width: `${maxValue > 0 ? (item.students / maxValue) * 100 : 0}%`
                    }}
                  ></div>
                  {item.students > 0 && (
                    <span className="absolute right-2 top-0 text-xs text-white leading-4">
                      {item.students}
                    </span>
                  )}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                      width: `${maxValue > 0 ? (item.teachers / maxValue) * 100 : 0}%`
                    }}
                  ></div>
                  {item.teachers > 0 && (
                    <span className="absolute right-2 top-0 text-xs text-white leading-4">
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

import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-600">{title}</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
              {trend && (
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                      trend.isPositive 
                        ? "bg-green-100 text-green-700 ring-1 ring-green-700/10" 
                        : "bg-red-100 text-red-700 ring-1 ring-red-700/10"
                    )}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  {trend.label && (
                    <span className="text-xs text-gray-500">{trend.label}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
    </Card>
  );
}

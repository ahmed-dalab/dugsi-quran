import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden transition-shadow hover:shadow-md", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
              {trend ? (
                <div className="flex items-center gap-2">
                  <Badge variant={trend.isPositive ? "success" : "destructive"}>
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </Badge>
                  {trend.label ? (
                    <span className="text-xs text-muted-foreground">{trend.label}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/5 opacity-50" />
    </Card>
  );
}

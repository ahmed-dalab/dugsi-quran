import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </Card>
  );
}

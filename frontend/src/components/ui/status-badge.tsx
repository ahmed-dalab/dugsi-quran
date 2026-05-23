import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export type StatusPreset =
  | "active"
  | "inactive"
  | "paid"
  | "partial"
  | "unpaid"
  | "ended"
  | "male"
  | "female";

const presetVariantMap: Record<StatusPreset, BadgeVariant> = {
  active: "success",
  paid: "success",
  male: "primary",
  inactive: "destructive",
  unpaid: "destructive",
  partial: "warning",
  ended: "warning",
  female: "secondary",
};

const presetLabelMap: Record<StatusPreset, string> = {
  active: "Active",
  inactive: "Inactive",
  paid: "Paid",
  partial: "Partial",
  unpaid: "Unpaid",
  ended: "Ended",
  male: "Male",
  female: "Female",
};

interface StatusBadgeProps {
  preset?: StatusPreset;
  variant?: BadgeVariant;
  children?: ReactNode;
  className?: string;
}

export function StatusBadge({ preset, variant, children, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? (preset ? presetVariantMap[preset] : "muted");
  const label = children ?? (preset ? presetLabelMap[preset] : null);

  return (
    <span className={cn(badgeVariants({ variant: resolvedVariant }), className)}>
      {label}
    </span>
  );
}

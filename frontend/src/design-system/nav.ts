import { cn } from "@/lib/utils";

export const sidebarNavLinkClass = (isActive: boolean) =>
  cn(
    "group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200",
    isActive
      ? "border-primary/20 bg-primary text-primary-foreground shadow-md"
      : "border-transparent text-foreground/80 hover:bg-muted hover:text-foreground hover:shadow-sm"
  );

export const sidebarShellClass =
  "sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card shadow-lg";

export const sidebarHeaderClass =
  "border-b border-border bg-gradient-to-b from-muted/50 to-card p-4";

export const topbarClass =
  "fixed top-0 left-0 right-0 z-40 border-b border-border bg-card px-4 py-3 md:left-64 md:px-6";

export const pageSurfaceClass = "flex-1 bg-surface p-4 pt-24 md:p-6 md:pt-24";

export const panelClass = "rounded-lg border border-border bg-card p-4";

export const tableShellClass = "hidden rounded-lg border border-border bg-card md:block";

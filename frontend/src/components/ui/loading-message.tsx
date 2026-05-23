import { cn } from "@/lib/utils";

interface LoadingMessageProps {
  message?: string;
  className?: string;
}

export function LoadingMessage({ message = "Loading...", className }: LoadingMessageProps) {
  return (
    <div className={cn("flex min-h-[40vh] items-center justify-center", className)}>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorMessage({ message = "Something went wrong.", className }: LoadingMessageProps) {
  return (
    <div className={cn("flex min-h-[40vh] items-center justify-center", className)}>
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}

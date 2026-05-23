import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface ListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ListSearch({
  value,
  onChange,
  placeholder = "Search...",
}: ListSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

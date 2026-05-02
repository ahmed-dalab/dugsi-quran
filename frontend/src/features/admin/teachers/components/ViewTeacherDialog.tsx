import { Eye } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { Teacher } from "../types/teacher.types";

interface ViewTeacherDialogProps {
  teacher: Teacher;
  triggerClassName?: string;
}

export default function ViewTeacherDialog({ teacher, triggerClassName }: ViewTeacherDialogProps) {
  return (
    <Button variant="ghost" size="sm" className={`gap-2 ${triggerClassName ?? ""}`} asChild>
      <Link to={`/admin/teachers/${teacher._id}`}>
        <Eye className="h-4 w-4" />
        View
      </Link>
    </Button>
  );
}

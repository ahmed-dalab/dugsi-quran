import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { AssignmentHistoryContent } from "@/features/admin/assignments/components/AssignmentHistory";
import { useGetTeacherQuery } from "../api/teacherApi";
import type { Teacher } from "../types/teacher.types";

const getUserName = (userId: Teacher["userId"]) =>
  typeof userId === "string" ? userId : (userId as any).name;

const getUserEmail = (userId: Teacher["userId"]) =>
  typeof userId === "string" ? "-" : (userId as any).email || "-";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "MMM dd, yyyy");
};

export default function TeacherDetails() {
  const { id = "" } = useParams();
  const { data, isLoading, isError } = useGetTeacherQuery(id, { skip: !id });

  if (!id) {
    return <div>Invalid teacher id.</div>;
  }

  if (isLoading) {
    return <div>Loading teacher details...</div>;
  }

  if (isError || !data?.data) {
    return <div>Failed to load teacher details.</div>;
  }

  const teacher = data.data;
  const teacherInfo = [
    { label: "Full Name", value: getUserName(teacher.userId) || "-" },
    { label: "Email", value: getUserEmail(teacher.userId) },
    { label: "Phone", value: teacher.phone || "-" },
    { label: "Address", value: teacher.address || "-" },
    { label: "Gender", value: teacher.gender || "-" },
    { label: "Hire Date", value: formatDate(teacher.hireDate) },
    { label: "Status", value: teacher.status },
    { label: "Created At", value: formatDate(teacher.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Teacher Details</h1>
          <p className="text-sm text-muted-foreground">
            Detailed teacher profile and assignment history.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/teachers" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </Link>
        </Button>
      </div>

      <section className="rounded-lg border bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Teacher Information</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {teacherInfo.map((item) => (
            <div key={item.label} className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium break-words">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Assignment History</h2>
        <AssignmentHistoryContent teacherId={teacher._id} />
      </section>
    </div>
  );
}

import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Link } from "react-router";

import { useAppSelector } from "@/app/hooks";
import ListSearch from "@/components/common/ListSearch";
import TablePagination from "@/components/common/TablePagination";
import { ListPageSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { AppSelect } from "@/components/ui/select";
import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { useListQueryState } from "@/hooks/useListQueryState";
import { LIST_ALL_PARAMS } from "@/lib/pagination";
import { PATHS } from "@/router/paths";
import AttendanceHistoryTable from "../components/AttendanceHistoryTable";
import { useGetAttendanceListQuery } from "../api/attendanceApi";

const ALL_CLASSES_VALUE = "all";

export default function AttendancePage() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);
  const [classFilter, setClassFilter] = useState("");
  const { search, setSearch, params, setPage } = useListQueryState();

  const listParams = useMemo(
    () => ({
      ...params,
      ...(classFilter ? { classId: classFilter } : {}),
    }),
    [params, classFilter]
  );

  const { data: classesData, isLoading: isClassesLoading } = useGetClassesQuery(LIST_ALL_PARAMS, {
    skip: isBootstrapping || !accessToken,
  });

  const { data, isLoading, isError, isFetching } = useGetAttendanceListQuery(listParams, {
    skip: isBootstrapping || !accessToken,
  });

  const classOptions = useMemo(
    () => [
      { value: ALL_CLASSES_VALUE, label: "All classes" },
      ...(classesData?.data.map((classItem) => ({
        value: classItem._id,
        label: classItem.name,
      })) ?? []),
    ],
    [classesData?.data]
  );

  if (isBootstrapping || isLoading || isClassesLoading) {
    return <ListPageSkeleton columns={5} />;
  }

  if (isError) {
    return <div>Failed to load attendance records.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            View attendance sessions across classes and take new attendance.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link to={PATHS.adminAttendanceTake}>
            <ClipboardCheck className="h-4 w-4" />
            Take Attendance
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_1fr]">
        <AppSelect
          value={classFilter || ALL_CLASSES_VALUE}
          onChange={(value) => {
            setClassFilter(value === ALL_CLASSES_VALUE ? "" : value ?? "");
            setPage(1);
          }}
          placeholder="Filter by class"
          isSearchable
          options={classOptions}
        />
        <ListSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by date..."
        />
      </div>

      {!data || data.data.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No attendance records found. Click <strong>Take Attendance</strong> to record the first session.
        </div>
      ) : (
        <AttendanceHistoryTable records={data.data} />
      )}

      <TablePagination
        pagination={data?.pagination}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </div>
  );
}

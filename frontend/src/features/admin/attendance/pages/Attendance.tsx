import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Link } from "react-router";

import AdminListPage from "@/components/common/AdminListPage";
import ListSearch from "@/components/common/ListSearch";
import { Button } from "@/components/ui/button";
import { AppSelect } from "@/components/ui/select";
import { useGetClassesQuery } from "@/features/admin/classes/api/classApi";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import { useListQueryState } from "@/hooks/useListQueryState";
import { LIST_ALL_PARAMS } from "@/lib/pagination";
import { PATHS } from "@/router/paths";
import AttendanceHistoryTable from "../components/AttendanceHistoryTable";
import { useGetAttendanceListQuery } from "../api/attendanceApi";

const ALL_CLASSES_VALUE = "all";

export default function AttendancePage() {
  const { skip, isBootstrapping } = useAuthQuerySkip();
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
    skip,
  });

  const { data, isLoading, isError, isFetching } = useGetAttendanceListQuery(listParams, { skip });

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

  return (
    <AdminListPage
      title="Attendance"
      description="View attendance sessions across classes and take new attendance."
      action={
        <Button asChild className="gap-2">
          <Link to={PATHS.adminAttendanceTake}>
            <ClipboardCheck className="h-4 w-4" />
            Take Attendance
          </Link>
        </Button>
      }
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Search by date...",
      }}
      filters={
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
          <ListSearch value={search} onChange={setSearch} placeholder="Search by date..." />
        </div>
      }
      pagination={{
        meta: data?.pagination,
        onPageChange: setPage,
        isLoading: isFetching,
      }}
      isBootstrapping={isBootstrapping}
      isLoading={isLoading || isClassesLoading}
      isError={isError}
      errorMessage="Failed to load attendance records."
      emptyMessage={
        <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No attendance records found. Click <strong>Take Attendance</strong> to record the first
          session.
        </div>
      }
      isEmpty={!data || data.data.length === 0}
      skeletonColumns={5}
    >
      {data && data.data.length > 0 ? <AttendanceHistoryTable records={data.data} /> : null}
    </AdminListPage>
  );
}

import { useMemo } from "react";

import { useAppSelector } from "@/app/hooks";
import { ReportsSkeleton } from "@/components/skeletons";
import { useGetReportsOverviewQuery } from "../api/reportApi";

const formatNumber = (value: number) => value.toLocaleString();
const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function Reports() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetReportsOverviewQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  const maxCollection = useMemo(() => {
    if (!data?.data.monthlyCollections?.length) {
      return 0;
    }

    return Math.max(...data.data.monthlyCollections.map((item) => item.amount));
  }, [data?.data.monthlyCollections]);

  if (isBootstrapping || isLoading) {
    return <ReportsSkeleton />;
  }

  if (isError || !data?.data) {
    return <div>Failed to load reports.</div>;
  }

  const report = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          School-wide reporting overview for administration.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Generated at: {new Date(report.generatedAt).toLocaleString()}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Students</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(report.summary.totalStudents)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Active: {formatNumber(report.summary.activeStudents)} | Inactive: {formatNumber(report.summary.inactiveStudents)}
          </p>
        </article>

        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Teachers & Classes</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(report.summary.totalTeachers)} Teachers</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Classes: {formatNumber(report.summary.totalClasses)} | Active assignments: {formatNumber(report.summary.activeAssignments)}
          </p>
        </article>

        <article className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Attendance (Last 30 Days)</p>
          <p className="mt-1 text-2xl font-semibold">{report.attendance.attendanceRate}%</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sessions: {formatNumber(report.attendance.sessionsLast30Days)} | Present/Late: {formatNumber(report.attendance.present + report.attendance.late)}
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="rounded-lg border bg-card p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Fees Report ({report.fees.month})</h2>
            <p className="text-sm text-muted-foreground">Collection and outstanding summary.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total Due</p>
              <p className="text-lg font-semibold">{formatCurrency(report.fees.totalDue)}</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-lg font-semibold">{formatCurrency(report.fees.totalCollected)}</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-lg font-semibold">{formatCurrency(report.fees.outstanding)}</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">Collection Rate</p>
              <p className="text-lg font-semibold">{report.fees.collectionRate}%</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b last:border-b-0">
                  <td className="px-3 py-2">Paid</td>
                  <td className="px-3 py-2">{formatNumber(report.fees.byStatus.paid)}</td>
                </tr>
                <tr className="border-b last:border-b-0">
                  <td className="px-3 py-2">Partial</td>
                  <td className="px-3 py-2">{formatNumber(report.fees.byStatus.partial)}</td>
                </tr>
                <tr className="border-b last:border-b-0">
                  <td className="px-3 py-2">Unpaid</td>
                  <td className="px-3 py-2">{formatNumber(report.fees.byStatus.unpaid)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border bg-card p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Monthly Collections</h2>
            <p className="text-sm text-muted-foreground">Amount paid in the last six months.</p>
          </div>

          <div className="space-y-3">
            {report.monthlyCollections.map((item) => {
              const width = maxCollection > 0 ? (item.amount / maxCollection) * 100 : 0;

              return (
                <div key={item.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.month}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-lg border bg-card p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Class Student Breakdown</h2>
          <p className="text-sm text-muted-foreground">Active student count by class.</p>
        </div>

        {report.classStudentBreakdown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No class data available.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Class</th>
                  <th className="px-3 py-2 text-left">Active Students</th>
                </tr>
              </thead>
              <tbody>
                {report.classStudentBreakdown.map((entry) => (
                  <tr key={entry.className} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{entry.className}</td>
                    <td className="px-3 py-2">{formatNumber(entry.studentCount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

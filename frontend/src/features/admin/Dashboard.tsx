import { useAppSelector } from "@/app/hooks";
import { ErrorMessage, LoadingMessage } from "@/components/ui/loading-message";
import { PageHeader } from "@/components/ui/page-header";
import { chartColors, getChartColor } from "@/design-system/tokens";
import { useGetDashboardStatsQuery } from "./dashboard/api/dashboardApi";
import MetricCard from "./dashboard/components/MetricCard";
import AnalyticsChart from "./dashboard/components/AnalyticsChart";
import TrendChart from "./dashboard/components/TrendChart";
import { Users, GraduationCap, UserCheck, BookOpen, Calendar, Activity } from "lucide-react";

function AdminDashboardPage() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <LoadingMessage message="Loading session..." />;
  }

  if (isLoading) {
    return <LoadingMessage message="Loading dashboard..." />;
  }

  if (isError || !data) {
    return <ErrorMessage message="Failed to load dashboard data." />;
  }

  const stats = data.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your Quranic school management system."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          description="Active enrolled students"
          trend={{
            value: stats.recentRegistrations > 0 ? 12 : 0,
            isPositive: true,
            label: "vs last month",
          }}
        />
        <MetricCard
          title="Teachers"
          value={stats.totalTeachers}
          icon={UserCheck}
          description="Teaching staff"
        />
        <MetricCard
          title="Classes"
          value={stats.totalClasses}
          icon={BookOpen}
          description="Active classes"
        />
        <MetricCard
          title="Assignments"
          value={stats.activeAssignments}
          icon={Calendar}
          description="Current assignments"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalyticsChart
          title="Student Demographics"
          subtitle="Gender distribution across all students"
          data={[
            { label: "Male Students", value: stats.studentsByGender.male, color: chartColors.primary },
            { label: "Female Students", value: stats.studentsByGender.female, color: chartColors.tertiary },
          ]}
        />

        <AnalyticsChart
          title="Assignment Status"
          subtitle="Current assignment distribution"
          data={[
            { label: "Active", value: stats.assignmentsByStatus.active, color: chartColors.primary },
            { label: "Completed", value: stats.assignmentsByStatus.ended, color: chartColors.quaternary },
            { label: "Inactive", value: stats.assignmentsByStatus.inactive, color: chartColors.accent },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendChart
          title="Registration Trends"
          subtitle="Monthly student and teacher registrations"
          data={stats.monthlyRegistrations}
        />

        <AnalyticsChart
          title="Class Distribution"
          subtitle="Top classes by student enrollment"
          data={stats.classDistribution.slice(0, 5).map((item, index) => ({
            label: item.className,
            value: item.studentCount,
            color: getChartColor(index),
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="All system accounts"
        />
        <MetricCard
          title="Recent Activity"
          value={stats.recentRegistrations}
          icon={Activity}
          description="New registrations (30 days)"
        />
        <MetricCard
          title="Assignment Status"
          value={`${stats.assignmentsByStatus.active}`}
          icon={Calendar}
          description={`${stats.assignmentsByStatus.ended} completed`}
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;

import { DashboardSkeleton } from "@/components/skeletons";
import { ErrorMessage } from "@/components/ui/loading-message";
import { PageHeader } from "@/components/ui/page-header";
import { dashboardChartColors } from "@/design-system/tokens";
import { useAuthQuerySkip } from "@/hooks/useAuthQuerySkip";
import {
  Activity,
  BookOpen,
  Calendar,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "./dashboard/api/dashboardApi";
import {
  DashboardCategoricalBarChart,
  DashboardGroupedBarChart,
} from "./dashboard/components/DashboardBarChart";
import DashboardPieChart from "./dashboard/components/DashboardPieChart";
import MetricCard from "./dashboard/components/MetricCard";

function AdminDashboardPage() {
  const { skip, isBootstrapping } = useAuthQuerySkip();

  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined, { skip });

  if (isBootstrapping || isLoading) {
    return <DashboardSkeleton />;
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          description="Active enrolled students"
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
          description="Current active assignments"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardPieChart
          title="Student Demographics"
          subtitle="Gender distribution across all students"
          data={[
            { label: "Male", value: stats.studentsByGender.male, color: dashboardChartColors.male },
            {
              label: "Female",
              value: stats.studentsByGender.female,
              color: dashboardChartColors.female,
            },
          ]}
        />

        <DashboardPieChart
          title="Assignment Status"
          subtitle="How teacher-class assignments are distributed"
          data={[
            { label: "Active", value: stats.assignmentsByStatus.active, color: dashboardChartColors.active },
            {
              label: "Completed",
              value: stats.assignmentsByStatus.ended,
              color: dashboardChartColors.completed,
            },
            {
              label: "Inactive",
              value: stats.assignmentsByStatus.inactive,
              color: dashboardChartColors.inactive,
            },
          ]}
        />
      </div>

      <DashboardGroupedBarChart
        title="Registration Trends"
        subtitle="Monthly student and teacher registrations"
        data={stats.monthlyRegistrations}
        xKey="month"
        series={[
          { key: "students", name: "Students", color: dashboardChartColors.students },
          { key: "teachers", name: "Teachers", color: dashboardChartColors.teachers },
        ]}
      />

      <DashboardCategoricalBarChart
        title="Class Enrollment"
        subtitle="Student count per class"
        data={stats.classDistribution.map((item) => ({
          label: item.className,
          value: item.studentCount,
        }))}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          description="New registrations in the last 30 days"
        />
        <MetricCard
          title="Completed Assignments"
          value={stats.assignmentsByStatus.ended}
          icon={Calendar}
          description="Assignments marked as ended"
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;

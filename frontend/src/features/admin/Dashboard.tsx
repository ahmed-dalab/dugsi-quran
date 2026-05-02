import { useAppSelector } from "@/app/hooks";
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading session...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Failed to load dashboard data.</div>
      </div>
    );
  }

  const stats = data.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's an overview of your Quranic school management system.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Students"
            value={stats.totalStudents}
            icon={GraduationCap}
            description="Active enrolled students"
            trend={{
              value: stats.recentRegistrations > 0 ? 12 : 0,
              isPositive: true,
              label: "vs last month"
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

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AnalyticsChart
            title="Student Demographics"
            subtitle="Gender distribution across all students"
            data={[
              { label: "Male Students", value: stats.studentsByGender.male, color: '#3b82f6' },
              { label: "Female Students", value: stats.studentsByGender.female, color: '#ec4899' }
            ]}
          />
          
          <AnalyticsChart
            title="Assignment Status"
            subtitle="Current assignment distribution"
            data={[
              { label: "Active", value: stats.assignmentsByStatus.active, color: '#10b981' },
              { label: "Completed", value: stats.assignmentsByStatus.ended, color: '#f59e0b' },
              { label: "Inactive", value: stats.assignmentsByStatus.inactive, color: '#8b5cf6' }
            ]}
          />
        </div>

        {/* Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart
            title="Registration Trends"
            subtitle="Monthly student and teacher registrations"
            data={stats.monthlyRegistrations}
          />
          
          <AnalyticsChart
            title="Class Distribution"
            subtitle="Top classes by student enrollment"
            data={stats.classDistribution.slice(0, 5).map(item => ({
              label: item.className,
              value: item.studentCount,
              color: '#06b6d4'
            }))}
          />
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}

export default AdminDashboardPage;

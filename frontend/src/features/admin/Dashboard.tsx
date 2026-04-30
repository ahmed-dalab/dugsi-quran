

import { useAppSelector } from "@/app/hooks";

import { Users, GraduationCap, UserCheck, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { useGetDashboardStatsQuery } from "./dashboard/api/dashboardApi";
import StatCard from "./dashboard/components/StatCard";
import BarChart from "./dashboard/components/BarChart";
import LineChart from "./dashboard/components/LineChart";

function AdminDashboardPage() {
  const { accessToken, isBootstrapping } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    skip: isBootstrapping || !accessToken,
  });

  if (isBootstrapping) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (isError || !data) {
    return <div>Failed to load dashboard data.</div>;
  }

  const stats = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your Quranic school management system.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          description="Active students"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={UserCheck}
          description="All teachers"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={BookOpen}
          description="Available classes"
        />
        <StatCard
          title="Active Assignments"
          value={stats.activeAssignments}
          icon={Calendar}
          description="Current teacher assignments"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Students by Gender */}
        <BarChart
          title="Students by Gender"
          data={[
            { label: "Male", value: stats.studentsByGender.male, color: '#3b82f6' },
            { label: "Female", value: stats.studentsByGender.female, color: '#ec4899' }
          ]}
        />

        {/* Teachers by Employment Type */}
        <BarChart
          title="Teachers by Employment Type"
          data={[
            { label: "Full-time", value: stats.teachersByEmploymentType["full-time"], color: '#10b981' },
            { label: "Part-time", value: stats.teachersByEmploymentType["part-time"], color: '#f59e0b' },
            { label: "Volunteer", value: stats.teachersByEmploymentType.volunteer, color: '#8b5cf6' }
          ]}
        />
      </div>

      {/* Monthly Registrations */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart
          title="Monthly Registrations (Last 6 Months)"
          data={stats.monthlyRegistrations}
        />

        {/* Class Distribution */}
        <BarChart
          title="Top Classes by Student Count"
          data={stats.classDistribution.slice(0, 5).map(item => ({
            label: item.className,
            value: item.studentCount,
            color: '#06b6d4'
          }))}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="All system users"
        />
        <StatCard
          title="Recent Registrations"
          value={stats.recentRegistrations}
          icon={TrendingUp}
          description="Last 30 days"
        />
        <StatCard
          title="Assignment Status"
          value={`${stats.assignmentsByStatus.active} active`}
          icon={Calendar}
          description={`${stats.assignmentsByStatus.ended} ended, ${stats.assignmentsByStatus.inactive} inactive`}
        />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
import type { AppRouteObject } from "@/router/route-types";
import RequireRole from "@/router/guards/RequireRole";
import { PATHS } from "@/router/paths";
import TeacherLayout from "@/layouts/TeacherLayout";

function TeacherDashboardPage() {
  return <div>Teacher Dashboard</div>;
}

export const teacherRoutes: AppRouteObject[] = [
  {
    element: <RequireRole allowedRoles={["Teacher"]} />,
    children: [
        {
        path: PATHS.teacher,
        element: <TeacherLayout />,
        children: [
            {
            index: true,
            element: <TeacherDashboardPage />,
            },
        ],
        },
    ],
  },
];
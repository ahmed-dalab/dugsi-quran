import type { AppRouteObject } from "@/router/route-types";
import RequireRole from "@/router/guards/RequireRole";
import { PATHS } from "@/router/paths";
import TeacherLayout from "@/layouts/TeacherLayout";
import TeacherDashboardPage from "@/features/teacher/pages/Dashboard";
import TeacherSettings from "@/features/teacher/pages/TeacherSettings";


export const teacherRoutes: AppRouteObject[] = [
  {
    element: <RequireRole allowedRoles={["teacher"]} />,
    children: [
        {
        path: PATHS.teacher,
        element: <TeacherLayout />,
        children: [
            {
            index: true,
            element: <TeacherDashboardPage />,
            },
            {
            path: "settings",
            element: <TeacherSettings />,
            },
        ],
        },
    ],
  },
];
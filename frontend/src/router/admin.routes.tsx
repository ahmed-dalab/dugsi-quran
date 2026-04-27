import type { AppRouteObject } from "@/router/route-types";
import RequireRole from "@/router/guards/RequireRole";
import AdminLayout from "@/layouts/AdminLayout";
import { PATHS } from "@/router/paths";

// Admin Pages
import AdminDashboardPage from "@/features/admin/Dashboard";
import Users from "@/features/admin/users/pages/Users";
import Classes from "@/features/admin/classes/pages/Classes";
import Students from "@/features/admin/students/pages/Students";
import Settings from "@/features/admin/settings/Settings";



export const adminRoutes: AppRouteObject[] = [
  {
    element: <RequireRole allowedRoles={["admin"]} />,
    children: [
      {
        path: PATHS.admin,
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "classes",
            element: <Classes />,
          },
          {
            path: "students",
            element: <Students />,
          },
          {
            path: "settings",
            element: <Settings />,

          }
        ],
      },
    ],
  },
];

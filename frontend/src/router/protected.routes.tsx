import type { AppRouteObject } from "@/router/route-types";
import RequireAuth from "@/router/guards/RequireAuth";
import { adminRoutes } from "@/router/admin.routes";
import { teacherRoutes } from "@/router/teacher.routes";

export const protectedRoutes: AppRouteObject[] = [
  {
    element: <RequireAuth />,
    children: [...adminRoutes, ...teacherRoutes],
  },
];
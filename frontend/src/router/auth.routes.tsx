import type { AppRouteObject } from "@/router/route-types";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/features/auth/pages/Login";
import { PATHS } from "@/router/paths";
import RequireUnauth from "@/router/guards/RequireUnauth";

export const authRoutes: AppRouteObject[] = [
  {
    element: <RequireUnauth />,
    children: [
      {
        path: PATHS.login,
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />,
          },
        ],
      },
    ],
  },
];
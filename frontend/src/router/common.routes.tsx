import { Navigate } from "react-router";
import type { AppRouteObject } from "@/router/route-types";
import { PATHS } from "@/router/paths";

function HomeRedirect() {
  return <Navigate to={PATHS.login} replace />;
}

function UnauthorizedPage() {
  return <div>Unauthorized</div>;
}

export const commonRoutes: AppRouteObject[] = [
  {
    path: PATHS.root,
    element: <HomeRedirect />,
  },
  {
    path: PATHS.unauthorized,
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <Navigate to={PATHS.login} replace />,
  },
];
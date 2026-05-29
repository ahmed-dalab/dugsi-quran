import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/app/hooks";
import { SessionSkeleton } from "@/components/skeletons";

export default function RequireUnauth() {
  const { isAuthenticated, isBootstrapping, user } = useAppSelector(
    (state) => state.auth
  );

  if (isBootstrapping) {
    return <SessionSkeleton />;
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user?.role === "teacher") {
      return <Navigate to="/teacher" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
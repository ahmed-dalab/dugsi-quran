import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/app/hooks";

type UserRole = "admin" | "teacher";

interface RequireRoleProps {
  allowedRoles: UserRole[];
}

export default function RequireRole({ allowedRoles }: RequireRoleProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
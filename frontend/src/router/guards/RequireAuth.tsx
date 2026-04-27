import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/app/hooks";

export default function RequireAuth() {
  const {isAuthenticated, isBootstrapping } = useAppSelector((state) => state.auth);
  const location = useLocation();
  
  if (isBootstrapping) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
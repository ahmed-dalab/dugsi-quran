import { createBrowserRouter } from "react-router";
import { authRoutes } from "@/router/auth.routes";
import { commonRoutes } from "@/router/common.routes";
import { protectedRoutes } from "./protected.routes";

export const router = createBrowserRouter([
  ...commonRoutes,
  ...authRoutes,
  ...protectedRoutes
]);
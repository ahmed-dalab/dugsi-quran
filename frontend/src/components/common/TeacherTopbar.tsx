import { LogOut, Menu, ShieldCheck, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";

const pageNames: Record<string, string> = {
  "/teacher": "Dashboard",
  "/teacher/settings": "Settings",

};

interface TeacherTopbarProps {
  onOpenMenu?: () => void;
}

export default function TeacherTopbar({ onOpenMenu }: TeacherTopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const [logout, { isLoading }] = useLogoutMutation();

  const currentPage = pageNames[location.pathname] || "Dashboard";

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearAuth());
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="border-b border-slate-200 bg-slate-100 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMenu}
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </Button>
          <ShieldCheck className="h-6 w-6 text-slate-700" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              {currentPage}
            </h1>
            <p className="mt-1 text-xs text-slate-500">Teacher Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-8 w-8 text-slate-700" />

            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold text-slate-900">
                {user?.name || "Unknown User"}
              </span>
              <span className="text-xs capitalize text-slate-500">
                {user?.role || "No Role"}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="gap-2 bg-blue-900 px-4 text-white hover:bg-blue-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoading ? "Logging out..." : "Logout"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

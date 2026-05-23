import { LogOut, Menu, ShieldCheck, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { topbarClass } from "@/design-system/nav";

const pageNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/classes": "Classes",
  "/admin/students": "Students",
  "/admin/fees": "Fees",
  "/admin/settings": "Settings",
  "/admin/reports": "Reports",
};

interface TopbarProps {
  onOpenMenu?: () => void;
}

export default function Topbar({ onOpenMenu }: TopbarProps) {
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
    <header className={topbarClass}>
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
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">{currentPage}</h1>
            <p className="mt-1 text-xs text-muted-foreground">Administration Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-8 w-8 text-muted-foreground" />

            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold">{user?.name || "Unknown User"}</span>
              <span className="text-xs capitalize text-muted-foreground">
                {user?.role || "No Role"}
              </span>
            </div>
          </div>

          <Button size="sm" onClick={handleLogout} disabled={isLoading} className="gap-2">
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

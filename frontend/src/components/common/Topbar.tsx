import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";

const pageNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/settings": "Settings",
 
};

export default function Topbar() {
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
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-md border border-primary/20">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground drop-shadow-sm">
              {currentPage}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Administration Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-gradient-to-r from-card/80 to-card/40 px-5 py-3 shadow-md backdrop-blur-sm">
            <div className="p-1 rounded-full bg-primary/10">
              <UserCircle2 className="h-8 w-8 text-primary" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">
                {user?.name || "Unknown User"}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {user?.role || "No Role"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="gap-2 border-primary/30 hover:bg-primary/15 hover:border-primary/50 hover:shadow-md transition-all duration-300 rounded-xl px-4"
          >
            <LogOut className="h-4 w-4" />
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
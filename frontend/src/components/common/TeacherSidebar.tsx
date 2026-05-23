import { NavLink } from "react-router";
import { LayoutDashboard, Settings } from "lucide-react";
import sidebarImage from "@/assets/sidebar2.png";
import { sidebarHeaderClass, sidebarNavLinkClass, sidebarShellClass } from "@/design-system/nav";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/teacher", name: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/teacher/settings", name: "Settings", icon: Settings },
];

interface TeacherSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function TeacherSidebar({ className, onNavigate }: TeacherSidebarProps) {
  return (
    <aside className={cn(sidebarShellClass, className)}>
      <div className={sidebarHeaderClass}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-24 w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
            <img
              src={sidebarImage}
              alt="Islamic Design"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => sidebarNavLinkClass(isActive)}
          >
            <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

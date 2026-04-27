import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Settings 
} from "lucide-react";
import sidebarImage from "@/assets/sidebar2.png";
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
    <aside
      className={cn(
        "sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl",
        className
      )}
    >
      <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-24 w-full overflow-hidden rounded-2xl bg-slate-100/80 shadow-sm">
            <img 
              src={sidebarImage} 
              alt="Islamic Design" 
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* <span className="text-lg font-bold tracking-wide text-slate-900">Admin</span> */}
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform ${
                isActive
                  ? "border border-blue-900/20 bg-blue-900 text-white shadow-md scale-[1.02]"
                  : "border border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm hover:scale-[1.01]"
              }`
            }
          >
            <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

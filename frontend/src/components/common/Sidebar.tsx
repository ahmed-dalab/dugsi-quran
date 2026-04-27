import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  Settings 
} from "lucide-react";
import sidebarImage from "@/assets/sidebar.png";

const navItems = [
  { path: "/admin", name: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/users", name: "Users", icon: Users },
  { path: "/admin/settings", name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="border-r border-sidebar-border bg-sidebar flex flex-col h-screen sticky top-0 shadow-xl">
      <div className="p-6 border-b border-sidebar-border/50 bg-gradient-to-b from-sidebar-accent/20 to-sidebar/50">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 rounded-2xl bg-sidebar-primary/10 shadow-lg backdrop-blur-sm">
            <img 
              src={sidebarImage} 
              alt="Islamic Design" 
              className="h-14 w-auto object-contain filter drop-shadow-sm"
            />
          </div>
          <span className="font-bold text-xl text-sidebar-foreground tracking-wide drop-shadow-sm">AdminHub</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-[1.02] border border-sidebar-primary/30"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md hover:scale-[1.01] hover:border hover:border-sidebar-accent/30"
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
import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
   <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import TeacherSidebar from "@/components/common/TeacherSidebar";
import TeacherTopbar from "@/components/common/TeacherTopbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Outlet } from "react-router";

export default function TeacherLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block">
        <TeacherSidebar />
      </div>

      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent
          showCloseButton={false}
          className="left-0 top-0 h-dvh w-72 max-w-none -translate-y-0 -translate-x-0 rounded-none border-0 p-0 ring-0"
        >
          <TeacherSidebar
            className="h-dvh w-full shadow-none"
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex min-w-0 flex-col">
        <TeacherTopbar onOpenMenu={() => setIsMobileMenuOpen(true)} />

           <main className="flex-1 bg-slate-100 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

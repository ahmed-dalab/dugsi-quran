import { Outlet } from "react-router";

export default function TeacherLayout() {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4">
        <h2 className="text-lg font-semibold">Teacher Panel</h2>
        <nav className="mt-4 space-y-2">
          <div>Dashboard</div>
          <div>Books</div>
          <div>Locations</div>
        </nav>
      </aside>

      <div className="flex flex-col">
        <header className="border-b p-4">
          <h1 className="text-xl font-bold">Teacher</h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PanelLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";

/**
 * Layout for all authenticated pages: fixed sidebar on the left,
 * page content on the right. Pages render through <Outlet />.
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (sidebar toggle) */}
        <header className="flex items-center gap-3 border-b border-slate-800 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">CollabDocs</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
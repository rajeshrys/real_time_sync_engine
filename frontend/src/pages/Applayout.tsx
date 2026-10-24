import { useState,useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { FileText, PanelLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

import { startPresence } from "../services/presenceWebsocket";

/**
 * Layout for all authenticated pages: fixed sidebar on the left,
 * page content on the right. Pages render through <Outlet />.
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    startPresence();
}, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar (sidebar toggle + logo + theme toggle) */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-2.5 backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/20">
                <FileText className="h-4 w-4" />
              </div>
              <span>CollabDocs</span>
            </Link>
          </div>

          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

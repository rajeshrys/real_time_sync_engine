import { NavLink, useNavigate } from "react-router-dom";
import {
  FilePlus,
  FileText,
  LogOut,
  PanelLeftClose,
  Share2,
  Trash2,
  Users,
  UserCheck,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getDocuments } from "../api/documentApi";
import { type DocumentResponse } from "../types/document";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "My documents", icon: FileText, end: true },
  { to: "/dashboard/shared", label: "Shared with me", icon: Share2, end: false },
  { to: "/dashboard/trash", label: "Trash", icon: Trash2, end: false },
  { to: "/dashboard/connections", label: "Find People", icon: Users, end: false },
  { to: "/dashboard/connections/requests", label: "Requests", icon: UserCheck, end: false },
];

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
    isActive
      ? "bg-slate-100 text-blue-600 dark:bg-slate-800/90 dark:text-blue-400 shadow-xs"
      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
  }`;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const [recentDocuments, setRecentDocuments] = useState<DocumentResponse[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const { user, logout } = useAuth() as ReturnType<typeof useAuth> & {
    logout?: () => void | Promise<void>;
  };
  const navigate = useNavigate();

  const initial = user?.firstName?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    await logout?.();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocuments(true);
        const documents = await getDocuments();
        setRecentDocuments(documents);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoadingDocuments(false);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out dark:border-slate-800/80 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 text-slate-900 dark:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              CollabDocs
            </span>
          </NavLink>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        {/* Action: New document */}
        <div className="px-3 pt-2">
          <button
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-all duration-150 hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.99]"
            onClick={() => {
              navigate("/documents/new");
              onClose();
            }}
          >
            <FilePlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>New document</span>
          </button>
        </div>

        {/* Navigation Library */}
        <nav className="mt-4 space-y-1 px-3" aria-label="Library">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={itemClass}
              onClick={onClose}
            >
              <Icon className="h-4 w-4 shrink-0 transition-colors" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Recents */}
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recents
          </div>

          {loadingDocuments ? (
            <div className="space-y-1 px-3 py-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ) : recentDocuments.length === 0 ? (
            <p className="px-3 py-1 text-xs text-slate-400 dark:text-slate-500">
              No documents yet
            </p>
          ) : (
            <ul className="space-y-0.5">
              {recentDocuments.slice(0, 8).map((doc) => (
                <li key={doc.id}>
                  <NavLink
                    to={`/documents/${doc.id}`}
                    className={itemClass}
                    onClick={onClose}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
                    <span className="truncate text-xs font-normal">
                      {doc.title || "Untitled document"}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile & Settings Footer */}
        <div className="border-t border-slate-200/80 p-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-xs">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}` : "Collab User"}
              </p>
              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
            </div>

            <ThemeToggle className="h-8 w-8 shrink-0 rounded-lg p-1" />

            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

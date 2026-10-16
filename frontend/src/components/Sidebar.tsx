import { NavLink, useNavigate } from "react-router-dom";
import {
  FilePlus,
  FileText,
  LogOut,
  PanelLeftClose,
  Search,
  Share2,
  Trash2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

// TODO: replace with data from your Document API (most recently edited first)
const recentDocuments = [
  { id: "1", title: "Project roadmap" },
  { id: "2", title: "Sprint planning notes" },
  { id: "3", title: "API design draft" },
  { id: "4", title: "Meeting minutes" },
];

const navItems = [
  { to: "/dashboard", label: "My documents", icon: FileText, end: true },
  { to: "/dashboard/shared", label: "Shared with me", icon: Share2, end: false },
  { to: "/dashboard/trash", label: "Trash", icon: Trash2, end: false },
];

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
    isActive
      ? "bg-gray-200/70 font-medium text-gray-900"
      : "text-gray-700 hover:bg-gray-200/50"
  }`;

const actionClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-200/50";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user, logout } = useAuth() as ReturnType<typeof useAuth> & {
    logout?: () => void | Promise<void>;
  };
  const navigate = useNavigate();

  const initial = user?.firstName?.charAt(0)?.toUpperCase() ?? "?";

  const handleLogout = async () => {
    await logout?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-gray-200 bg-gray-50 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="text-base font-semibold tracking-tight text-gray-900">
            CollabDocs
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200/60 lg:hidden"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-0.5 px-3">
          <button
            className={actionClass}
            onClick={() => {
              navigate("/documents/new");
              onClose();
            }}
          >
            <FilePlus className="h-4 w-4" />
            New document
          </button>

          <button className={actionClass}>
            <Search className="h-4 w-4" />
            Search documents
          </button>
        </div>

        {/* Library */}
        <nav className="mt-3 space-y-0.5 px-3" aria-label="Library">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={itemClass}
              onClick={onClose}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Recents */}
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-3">
          <p className="px-3 pb-2 text-xs text-gray-500">Recents</p>

          {recentDocuments.length === 0 ? (
            <p className="px-3 text-sm text-gray-500">
              Documents you open will show up here.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {recentDocuments.map((doc) => (
                <li key={doc.id}>
                  <NavLink
                    to={`/documents/${doc.id}`}
                    className={itemClass}
                    onClick={onClose}
                  >
                    <span className="truncate">{doc.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
              {initial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200/60 hover:text-gray-900"
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
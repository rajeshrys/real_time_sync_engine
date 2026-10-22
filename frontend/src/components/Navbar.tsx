import { Link, useNavigate } from "react-router-dom";
import { FileText, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <FileText className="h-4 w-4" />
          </div>
          <span>CollabDocs</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Dashboard
          </Link>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-semibold text-white shadow-xs">
                {user.firstName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
              </div>

              <span className="hidden text-xs font-medium text-slate-700 dark:text-slate-300 sm:block">
                {user.firstName}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg p-1 text-slate-400 transition hover:text-red-500"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

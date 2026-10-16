import { Link, useNavigate } from "react-router-dom";
import { FileText, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <FileText className="h-6 w-6 text-blue-500" />
          CollabDocs
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Dashboard
          </Link>

          {user && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                <User className="h-4 w-4 text-white" />
              </div>

              <span className="hidden text-sm text-slate-300 sm:block">
                {user.firstName}
              </span>

              <button
                onClick={handleLogout}
                className="text-slate-400 transition hover:text-red-400"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}

          {!user && (
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
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
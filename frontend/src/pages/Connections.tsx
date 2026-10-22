import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserRound, X, Loader2, UserPlus, Users, Clock, Check } from "lucide-react";
import { searchUsers, type UserSearchResult } from "../api/user";
import { sendConnectRequest } from "../api/connection";

export default function Connections() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectingUserId, setConnectingUserId] = useState<number | null>(null);

  const searchRequestId = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || trimmedQuery.length < 2) {
      setUsers([]);
      setLoading(false);
      setError("");
      return;
    }

    const requestId = ++searchRequestId.current;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await searchUsers(trimmedQuery);

        if (requestId !== searchRequestId.current) return;
        setUsers(results);
      } catch (err) {
        console.error("User search failed:", err);
        if (requestId !== searchRequestId.current) return;
        setUsers([]);
        setError("Unable to search users right now. Please try again.");
      } finally {
        if (requestId === searchRequestId.current) {
          setLoading(false);
        }
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setUsers([]);
    setError("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      clearSearch();
    }
  };

  const handleConnect = async (userId: number) => {
    try {
      setConnectingUserId(userId);
      await sendConnectRequest(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, connectionStatus: "PENDING" }
            : user
        )
      );
    } catch (err) {
      console.error("Failed to send connection request:", err);
    } finally {
      setConnectingUserId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 antialiased">
      {/* Header & Tabs */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              People & Collaboration
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Connect with teammates and collaborate in real-time.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-3.5 w-3.5" />
              Find People
            </span>
            <Link
              to="/dashboard/connections/requests"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, username or email..."
          className="w-full rounded-2xl border border-slate-200/90 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400"
        />

        {loading && (
          <Loader2
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
          />
        )}

        {!loading && query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {query.trim().length === 1 && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Enter at least 2 characters to search.
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && query.trim().length >= 2 && users.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Search results ({users.length})
          </div>

          <div className="space-y-2.5">
            {users.map((user) => {
              const initials =
                `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

              const isPending = user.connectionStatus === "PENDING";
              const isAccepted = user.connectionStatus === "ACCEPTED";
              const isConnecting = connectingUserId === user.id;

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800/90 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-xs">
                      {initials || <UserRound size={18} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        @{user.username} • {user.email}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConnect(user.id)}
                    disabled={isConnecting || isPending || isAccepted}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                      isAccepted
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : isPending
                        ? "border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400"
                        : "bg-blue-600 text-white shadow-xs hover:bg-blue-500"
                    }`}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : isPending ? (
                      <>
                        <Clock size={14} />
                        <span>Pending</span>
                      </>
                    ) : isAccepted ? (
                      <>
                        <Check size={14} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && query.trim().length >= 2 && users.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white/40 p-10 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Search size={20} className="text-slate-400" />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            No users found
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try searching with a different name or email address.
          </p>
        </div>
      )}

      {/* Empty Initial State */}
      {!query.trim() && (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white/40 p-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <UserRound size={24} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            Find teammates to collaborate with
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Search for people by username or email to send them a connection request.
          </p>
        </div>
      )}
    </div>
  );
}

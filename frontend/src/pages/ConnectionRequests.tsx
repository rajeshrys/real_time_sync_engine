import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Loader2,
  UserRound,
  X,
  UserPlus,
  Users,
} from "lucide-react";

import {
  acceptConnectionRequest,
  getPendingRequests,
  rejectConnectionRequest,
  type ConnectionRequest,
} from "../api/connection";

export default function ConnectionRequests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load connection requests:", err);
      setError("Unable to load connection requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (connectionId: number) => {
    try {
      setProcessingId(connectionId);
      await acceptConnectionRequest(connectionId);
      setRequests((prev) =>
        prev.filter((request) => request.connectionId !== connectionId)
      );
    } catch (err) {
      console.error("Failed to accept request:", err);
      setError("Unable to accept connection request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (connectionId: number) => {
    try {
      setProcessingId(connectionId);
      await rejectConnectionRequest(connectionId);
      setRequests((prev) =>
        prev.filter((request) => request.connectionId !== connectionId)
      );
    } catch (err) {
      console.error("Failed to reject request:", err);
      setError("Unable to reject connection request.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 antialiased">
      {/* Header & Tabs */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Connection Requests
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Teammates who requested to connect with your workspace.
            </p>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <Link
              to="/dashboard/connections"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Users className="h-3.5 w-3.5" />
              Find People
            </Link>
            <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <UserPlus className="h-3.5 w-3.5" />
              Requests {requests.length > 0 && `(${requests.length})`}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-12 text-center dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <UserRound size={24} className="text-slate-400 dark:text-slate-500" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            No pending requests
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            You don&apos;t have any connection requests right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const initials =
              `${request.firstName?.[0] ?? ""}${request.lastName?.[0] ?? ""}`.toUpperCase();
            const processing = processingId === request.connectionId;

            return (
              <div
                key={request.connectionId}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-slate-300 dark:border-slate-800/90 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-xs">
                    {initials || <UserRound size={18} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {request.firstName} {request.lastName}
                    </div>

                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      @{request.username} • {request.email}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleAccept(request.connectionId)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-500 active:scale-95 disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    <span>Accept</span>
                  </button>

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleReject(request.connectionId)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

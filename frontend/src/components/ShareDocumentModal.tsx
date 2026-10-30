import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UserPlus,
  Trash2,
  Loader2,
  Search,
  UserCheck,
} from "lucide-react";
import { getConnections, type ConnectionMember } from "../api/connection";
import {
  getDocumentMembers,
  removeMember,
  shareDocument,
  updateMemberRole,
} from "../api/documentShareApi";
import type { DocumentMember } from "../types/document";

interface ShareDocumentModalProps {
  documentId: number;
  onClose: () => void;
}

const ShareDocumentModal = ({
  documentId,
  onClose,
}: ShareDocumentModalProps) => {
  const [members, setMembers] = useState<DocumentMember[]>([]);
  const [connections, setConnections] = useState<ConnectionMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionMember | null>(null);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");

  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setActionError(null);
      const data = await getDocumentMembers(documentId);
      setMembers(data);
    } catch (error) {
      console.error("Failed to load document members", error);
      setActionError("Failed to load document members");
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      console.error("Failed to load connections", error);
    }
  };

  useEffect(() => {
    loadMembers();
    loadConnections();
  }, [documentId]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Click outside to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard shortcut: Escape to close dropdown or modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showSuggestions) {
          setShowSuggestions(false);
        } else if (username || selectedConnection) {
          handleCancelInput();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuggestions, username, selectedConnection]);

  // Filter connections excluding users who are already members
  const memberUsernames = new Set(
    members.map((m) => m.userName?.toLowerCase()).filter(Boolean)
  );

  const filteredConnections = connections.filter((conn) => {
    const matchesSearch =
      conn.username.toLowerCase().includes(username.toLowerCase()) ||
      `${conn.firstName} ${conn.lastName}`
        .toLowerCase()
        .includes(username.toLowerCase());
    return matchesSearch && !memberUsernames.has(conn.username.toLowerCase());
  });

  const handleSelectConnection = (connection: ConnectionMember) => {
    setSelectedConnection(connection);
    setUsername(connection.username);
    setShowSuggestions(false);
    setActionError(null);
  };

  const handleCancelInput = () => {
    setUsername("");
    setSelectedConnection(null);
    setShowSuggestions(false);
    setActionError(null);
    inputRef.current?.focus();
  };

  // =========================
  // SHARE DOCUMENT
  // =========================
  const handleShare = async () => {
    const targetUsername = username.trim();
    if (!targetUsername) {
      return;
    }

    try {
      setSharing(true);
      setActionError(null);

      const newMember = await shareDocument(documentId, {
        username: targetUsername,
        role,
      });

      setMembers((prev) => [...prev, newMember]);
      setUsername("");
      setSelectedConnection(null);
      setRole("EDITOR");
    } catch (error: any) {
      console.error("Failed to share document", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to share document. Please ensure the username exists.";
      setActionError(msg);
    } finally {
      setSharing(false);
    }
  };

  // =========================
  // CHANGE MEMBER ROLE
  // =========================
  const handleRoleChange = async (
    member: DocumentMember,
    newRole: "EDITOR" | "VIEWER"
  ) => {
    try {
      setActionError(null);
      const updatedMember = await updateMemberRole(
        documentId,
        member.userId,
        newRole
      );

      setMembers((prev) =>
        prev.map((m) => (m.userId === member.userId ? updatedMember : m))
      );
    } catch (error) {
      console.error("Failed to update role", error);
      setActionError("Failed to update role");
    }
  };

  // =========================
  // STOP SHARING / REMOVE MEMBER
  // =========================
  const handleRemove = async (member: DocumentMember) => {
    const memberName =
      member.userName || `${member.firstName} ${member.lastName}`.trim();
    const confirmed = window.confirm(
      `Stop sharing with ${memberName}? They will lose access immediately.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionError(null);
      await removeMember(documentId, member.userId);
      setMembers((prev) => prev.filter((m) => m.userId !== member.userId));
    } catch (error) {
      console.error("Failed to remove member", error);
      setActionError("Failed to remove collaborator");
    }
  };

  const isInputActive = Boolean(username.trim() || selectedConnection);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-xs pt-16 sm:pt-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Share document
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Invite people from your connections to collaborate
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            title="Close modal (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error notification */}
        {actionError && (
          <div className="mx-6 mt-4 flex items-center justify-between rounded-lg bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="ml-2 hover:opacity-75"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Share user form section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Add collaborators
          </label>

          {/* Selected Connection Preview Card (if picked) */}
          {selectedConnection ? (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/60 dark:bg-blue-950/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {selectedConnection.firstName?.charAt(0).toUpperCase() ||
                    selectedConnection.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {selectedConnection.firstName} {selectedConnection.lastName}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      <UserCheck size={11} /> Connection
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    @{selectedConnection.username} • {selectedConnection.email}
                  </p>
                </div>
              </div>

              {/* Exit / Deselect button */}
              <button
                type="button"
                onClick={handleCancelInput}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                title="Cancel user selection (Esc)"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            </div>
          ) : null}

          {/* Input & controls */}
          <div className="flex gap-2" ref={containerRef}>
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                ref={inputRef}
                type="text"
                placeholder="Search connection or enter username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowSuggestions(true);
                  if (selectedConnection) {
                    setSelectedConnection(null);
                  }
                }}
                onFocus={() => {
                  if (username.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && username.trim() && !sharing) {
                    handleShare();
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-400"
              />

              {/* Clear / Exit input button */}
              {username && (
                <button
                  type="button"
                  onClick={handleCancelInput}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  title="Clear input (Esc)"
                >
                  <X size={14} />
                </button>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && username.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <span>Suggested connections</span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Close ✕
                    </button>
                  </div>

                  {filteredConnections.length > 0 ? (
                    filteredConnections.map((connection) => (
                      <button
                        key={connection.id}
                        type="button"
                        onClick={() => handleSelectConnection(connection)}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {connection.firstName?.charAt(0).toUpperCase() ||
                              connection.username.charAt(0).toUpperCase()}
                            {connection.active && (
                              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                              {connection.firstName} {connection.lastName}
                            </p>
                            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                              @{connection.username}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                          Select
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-center text-xs text-slate-500">
                      No matching connections found.
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        You can still share with{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          @{username.trim()}
                        </span>{" "}
                        by clicking Share.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role dropdown */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
              className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="EDITOR">Can edit</option>
              <option value="VIEWER">Can view</option>
            </select>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing || !username.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {sharing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              <span>Share</span>
            </button>
          </div>

          {/* Quick exit bar if input has content */}
          {isInputActive && (
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Press Enter to share, or Esc to cancel</span>
              <button
                type="button"
                onClick={handleCancelInput}
                className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline underline-offset-2"
              >
                Clear and exit
              </button>
            </div>
          )}
        </div>

        {/* Existing Members / People with access */}
        <div className="max-h-72 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              People with access ({members.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-slate-400" size={24} />
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
              Only you have access to this document.
            </div>
          ) : (
            <div className="space-y-2.5">
              {members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {member.firstName?.charAt(0).toUpperCase() ||
                        member.userName?.charAt(0).toUpperCase() ||
                        "?"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                        {member.firstName} {member.lastName}
                        {member.userName && (
                          <span className="ml-1 text-[11px] text-slate-400">
                            (@{member.userName})
                          </span>
                        )}
                      </p>
                      <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {member.role === "OWNER" ? (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Owner
                      </span>
                    ) : (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(
                              member,
                              e.target.value as "EDITOR" | "VIEWER"
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <option value="EDITOR">Can edit</option>
                          <option value="VIEWER">Can view</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemove(member)}
                          className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
                          title="Stop sharing with this user (remove access)"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50/60 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareDocumentModal;

import { useEffect, useState } from "react";
import {
  X,
  UserPlus,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getDocumentMembers,
  removeMember,
  shareDocument,
  updateMemberRole,
} from '../api/documentShareApi'

import type {
  DocumentMember,
  DocumentRole,
} from "../types/document";

interface ShareDocumentModalProps {
  documentId: number;
  onClose: () => void;
}

const ShareDocumentModal = ({
  documentId,
  onClose,
}: ShareDocumentModalProps) => {
  const [members, setMembers] = useState<DocumentMember[]>([]);

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");

  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const loadMembers = async () => {
    try {
      setLoading(true);

      const data = await getDocumentMembers(documentId);

      setMembers(data);
    } catch (error) {
      console.error("Failed to load document members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [documentId]);

  const handleShare = async () => {
    if (!userId.trim()) {
      return;
    }

    try {
      setSharing(true);

      const newMember = await shareDocument(documentId, {
        userId: Number(userId),
        role,
      });

      setMembers((prev) => [...prev, newMember]);

      setUserId("");
      setRole("EDITOR");
    } catch (error) {
      console.error("Failed to share document", error);
      alert("Failed to share document");
    } finally {
      setSharing(false);
    }
  };

  const handleRoleChange = async (
    member: DocumentMember,
    newRole: "EDITOR" | "VIEWER"
  ) => {
    try {
      const updatedMember = await updateMemberRole(
        documentId,
        member.userId,
        newRole
      );

      setMembers((prev) =>
        prev.map((m) =>
          m.userId === member.userId ? updatedMember : m
        )
      );
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Failed to update role");
    }
  };

  const handleRemove = async (member: DocumentMember) => {
    const confirmed = window.confirm(
      `Remove ${member.email} from this document?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeMember(documentId, member.userId);

      setMembers((prev) =>
        prev.filter((m) => m.userId !== member.userId)
      );
    } catch (error) {
      console.error("Failed to remove member", error);
      alert("Failed to remove member");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl dark:bg-gray-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold">
              Share document
            </h2>

            <p className="text-sm text-gray-500">
              Manage who can access this document
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Share user */}
        <div className="border-b p-6 dark:border-gray-700">
          <div className="flex gap-2">

            <input
              type="number"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2"
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value as "EDITOR" | "VIEWER"
                )
              }
              className="rounded-lg border px-3 py-2"
            >
              <option value="EDITOR">
                Editor
              </option>

              <option value="VIEWER">
                Viewer
              </option>
            </select>

            <button
              onClick={handleShare}
              disabled={sharing || !userId}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {sharing ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <UserPlus size={18} />
              )}

              Share
            </button>

          </div>
        </div>

        {/* Members */}
        <div className="max-h-96 overflow-y-auto p-6">

          <h3 className="mb-4 text-sm font-semibold">
            People with access
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2
                className="animate-spin"
                size={24}
              />
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500">
              No members found.
            </p>
          ) : (
            <div className="space-y-3">

              {members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700"
                >

                  <div className="min-w-0">
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {member.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">

                    {member.role === "OWNER" ? (
                      <span className="rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                        Owner
                      </span>
                    ) : (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(
                              member,
                              e.target.value as
                                | "EDITOR"
                                | "VIEWER"
                            )
                          }
                          className="rounded-md border px-2 py-1 text-sm"
                        >
                          <option value="EDITOR">
                            Editor
                          </option>

                          <option value="VIEWER">
                            Viewer
                          </option>
                        </select>

                        <button
                          onClick={() =>
                            handleRemove(member)
                          }
                          className="rounded-md p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShareDocumentModal;
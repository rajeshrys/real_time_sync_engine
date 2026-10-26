import { useEffect, useState } from "react";
import {
  X,
  UserPlus,
  Trash2,
  Loader2,
} from "lucide-react";
import { getConnections,type ConnectionMember } from "../api/connection";

import {
  getDocumentMembers,
  removeMember,
  shareDocument,
  updateMemberRole,
} from "../api/documentShareApi";

import { getSharedDocuments } from "../api/documentApi";
import { type SharedDocument } from "../types/document";

import type {
  DocumentMember,
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
  const [connections, setConnections] = useState<ConnectionMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionMember | null>(null);

    const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);

  // Changed from userId to username
  const [username, setUsername] = useState("");

  const [role, setRole] =
    useState<"EDITOR" | "VIEWER">("EDITOR");

  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);


    const loadSharedDocuments = async () => {
    try {
      const data = await getSharedDocuments();
  
      setSharedDocuments(data);
      console.log(shareDocument);
    } catch (error) {
      console.error(
        "Failed to load shared documents",
        error
      );
    }
  };

  const loadMembers = async () => {
    try {
      setLoading(true);

      const data = await getDocumentMembers(documentId);

      setMembers(data);
    } catch (error) {
      console.error(
        "Failed to load document members",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  const loadConnections = async()=>{
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      console.log("failed to load connections");
    }
  }

  useEffect(() => {
    loadMembers();
    loadConnections();
    loadSharedDocuments();
  }, [documentId]);

const filteredConnections = connections.filter((connection) =>
  connection.username
    .toLowerCase()
    .includes(username.toLowerCase())
);

  const handleSelectConnection = (
  connection: ConnectionMember
) => {
  setSelectedConnection(connection);
  setUsername(connection.username);
  setShowSuggestions(false);
};

  // =========================
  // SHARE DOCUMENT
  // =========================
const handleShare = async () => {
  if (!username.trim()) {
    return;
  }

  try {
    setSharing(true);

    const newMember = await shareDocument(documentId, {
      username: username.trim(),
      role,
    });

    setMembers((prev) => [...prev, newMember]);

    setUsername("");
    setRole("EDITOR");
  } catch (error) {
    console.error("Failed to share document", error);
    alert("Failed to share document");
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

      const updatedMember =
        await updateMemberRole(
          documentId,
          member.userId,
          newRole
        );

      setMembers((prev) =>
        prev.map((m) =>
          m.userId === member.userId
            ? updatedMember
            : m
        )
      );

    } catch (error) {

      console.error(
        "Failed to update role",
        error
      );

      alert("Failed to update role");
    }
  };

  // =========================
  // REMOVE MEMBER
  // =========================
  const handleRemove = async (
    member: DocumentMember
  ) => {

    const confirmed = window.confirm(
      `Remove ${member.email} from this document?`
    );

    if (!confirmed) {
      return;
    }

    try {

      await removeMember(
        documentId,
        member.userId
      );

      setMembers((prev) =>
        prev.filter(
          (m) => m.userId !== member.userId
        )
      );

    } catch (error) {

      console.error(
        "Failed to remove member",
        error
      );

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

                {/* showing the shared documents */}
        <div className="mt-8">
  <h2 className="mb-4 text-xl font-semibold">
    Shared with me
  </h2>

  {sharedDocuments.length === 0 ? (
    <p className="text-sm text-gray-500">
      No documents have been shared with you.
    </p>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sharedDocuments.map((document) => (
        <div
          key={document.id}
          className="rounded-lg border p-4 shadow-sm"
        >
          <h3 className="font-semibold">
            {document.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Shared by @{document.ownerUsername}
          </p>

          <span className="mt-3 inline-block rounded-md bg-gray-100 px-2 py-1 text-xs">
            {document.role}
          </span>
        </div>
      ))}
    </div>
  )}
</div>


        {/* Share user */}
        <div className="border-b p-6 dark:border-gray-700">

      <div className="border-b p-6 dark:border-gray-700">

        <div className="flex gap-2">

          <div className="relative flex-1">

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setShowSuggestions(true);
                setSelectedConnection(null);
              }}
              onFocus={() => {
                if (username.trim()) {
                  setShowSuggestions(true);
                }
              }}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            />

            {showSuggestions &&
              username.trim() &&
              filteredConnections.length > 0 && (

                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">

                  {filteredConnections.map((connection) => (

                    <button
                      key={connection.id}
                      type="button"
                      onClick={() =>
                        handleSelectConnection(connection)
                      }
                      className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-semibold dark:bg-gray-700">
                        {connection.firstName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="font-medium">
                          {connection.firstName}{" "}
                          {connection.lastName}
                        </p>

                        <p className="text-sm text-gray-500">
                          @{connection.username}
                        </p>

                      </div>

                    </button>

                  ))}

                </div>
              )}

          </div>

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as "EDITOR" | "VIEWER"
              )
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
          </select>

          <button
            onClick={handleShare}
            disabled={
              sharing ||
              !selectedConnection
            }
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
                      {member.firstName}{" "}
                      {member.lastName}
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
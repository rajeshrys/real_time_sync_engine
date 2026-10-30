import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Users,
  RotateCcw,
  Check,
  AlertCircle,
  Save,
  UserPlus,
} from "lucide-react";

import TiptapEditor from "../components/TiptapEditor";
import api from "../api/axios";
import {
  getDocumentById,
  restoreDocument,
  permanentlyDeleteDocument,
} from "../api/documentApi";
import ThemeToggle from "../components/ThemeToggle";
import ShareDocumentModal from "../components/ShareDocumentModal";

type Status = {
  type: "success" | "error";
  message: string;
} | null;

const DocumentEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<object | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);

  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [isTrashed, setIsTrashed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  /* Load an existing document */
  useEffect(() => {
    if (!id) return;

    const loadDocument = async () => {
      try {
        const document = await getDocumentById(Number(id));

        setDocumentId(Number(id));
        setTitle(document.title);
        setIsTrashed(document.deletedAt !== null);

        const parsedContent =
          typeof document.content === "string"
            ? JSON.parse(document.content)
            : document.content;

        setContent(parsedContent);
      } catch (error) {
        console.error("Failed to load document:", error);
        setStatus({
          type: "error",
          message: "Could not load this document.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  /* Hide status message after a few seconds */
  useEffect(() => {
    if (!status) return;

    const timer = setTimeout(() => {
      setStatus(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [status]);

  /* Create or update document */
  const handleSave = async () => {
    if (isTrashed) {
      setStatus({
        type: "error",
        message: "Restore the document before editing.",
      });
      return;
    }

    if (!title.trim()) {
      setStatus({
        type: "error",
        message: "Please add a title before saving.",
      });
      return;
    }

    try {
      setSaving(true);

      if (documentId === null) {
        const response = await api.post("/documents/new", {
          title,
          content,
        });

        const newDocumentId = response.data.id;
        setDocumentId(newDocumentId);

        setStatus({
          type: "success",
          message: "Document created successfully.",
        });

        navigate(`/documents/${newDocumentId}`, { replace: true });
      } else {
        await api.put(`/documents/${documentId}`, {
          title,
          content,
        });

        setStatus({
          type: "success",
          message: "All changes saved.",
        });
      }
    } catch (error) {
      console.error("Error saving document:", error);
      setStatus({
        type: "error",
        message: "Could not save the document.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* Soft delete */
  const handleDelete = async () => {
    if (documentId === null) return;

    const confirmed = window.confirm(
      "Are you sure you want to move this document to trash?"
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await api.delete(`/documents/${documentId}`);
      navigate("/dashboard/trash");
    } catch (error) {
      console.error("Error deleting document:", error);
      setStatus({
        type: "error",
        message: "Could not delete the document.",
      });
      setDeleting(false);
    }
  };

  /* Restore document */
  const handleRestore = async () => {
    if (documentId === null) return;

    try {
      setDeleting(true);
      await restoreDocument(documentId);
      setIsTrashed(false);
      setStatus({
        type: "success",
        message: "Document restored.",
      });
    } catch (error) {
      console.error("Failed to restore document:", error);
      setStatus({
        type: "error",
        message: "Could not restore the document.",
      });
    } finally {
      setDeleting(false);
    }
  };

  /* Permanently delete document */
  const handlePermanentDelete = async () => {
    if (documentId === null) return;

    const confirmed = window.confirm(
      "This will permanently delete the document. This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await permanentlyDeleteDocument(documentId);
      navigate("/dashboard/trash");
    } catch (error) {
      console.error("Error permanently deleting document:", error);
      setStatus({
        type: "error",
        message: "Could not permanently delete the document.",
      });
      setDeleting(false);
    }
  };

  /* Collaboration */
  const handleCollaborate = () => {
    if (documentId === null) return;
    setStatus({
      type: "success",
      message: "Real-time sync is active for this document.",
    });
  };

  const isNew = documentId === null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-6 py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Back button */}
            <button
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Title Input */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isTrashed}
              type="text"
              placeholder="Untitled document"
              aria-label="Document title"
              className="min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-2.5 py-1 text-lg font-semibold tracking-tight text-slate-900 placeholder-slate-400 outline-none transition hover:border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-700 dark:focus:border-blue-400"
            />
          </div>

          {/* share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <UserPlus size={16} />
            <span>Share</span>
          </button>

          {/* Actions & Status */}
          <div className="flex items-center gap-2">
            {/* Toast status message */}
            {status && (
              <div
                role="status"
                className={`hidden items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium sm:inline-flex ${
                  status.type === "error"
                    ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                }`}
              >
                {status.type === "error" ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Collaborate indicator */}
            {!isTrashed && (
              <button
                onClick={handleCollaborate}
                disabled={isNew}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Users className="h-3.5 w-3.5 text-blue-500" />
                <span className="hidden sm:inline">Collaborate</span>
              </button>
            )}

            {/* Trash Actions */}
            {!isTrashed ? (
              <button
                onClick={handleDelete}
                disabled={isNew || deleting}
                aria-label="Delete document"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-xs transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Trash</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleRestore}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore</span>
                </button>

                <button
                  onClick={handlePermanentDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete permanently</span>
                </button>
              </>
            )}

            {/* Save Button */}
            {!isTrashed && (
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>{saving ? "Saving..." : isNew ? "Save" : "Save changes"}</span>
              </button>
            )}

            <ThemeToggle className="ml-1" />
          </div>
        </div>

        {/* Small Screen Status Notice */}
        {status && (
          <div
            role="status"
            className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-medium sm:hidden ${
              status.type === "error"
                ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            }`}
          >
            {status.message}
          </div>
        )}
      </header>

      {/* Editor Main Canvas */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-12 text-slate-500 dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium">Loading document...</p>
          </div>
        ) : (
          <TiptapEditor
            documentId={documentId!}
            userId={1}
            content={content}
            editable={!isTrashed}
            onChange={(content) => {
              setContent(content);
            }}
          />
        )}
      </main>

      {/* Share Document Modal */}
      {showShareModal && documentId && (
        <ShareDocumentModal
          documentId={Number(documentId)}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default DocumentEditor;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Trash2, Users } from "lucide-react";

import TiptapEditor from "../components/TiptapEditor";
import api from "../api/axios";
import { getDocumentById } from "../api/documentApi";

type Status = { type: "success" | "error"; message: string } | null;

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

  /* Load an existing document */
  useEffect(() => {
    if (!id) return;

    const loadDocument = async () => {
      try {
        const document = await getDocumentById(Number(id));
        setDocumentId(Number(id));
        setTitle(document.title);

        const parsedContent =
          typeof document.content === "string"
            ? JSON.parse(document.content)
            : document.content;

        setContent(parsedContent);
      } catch (error) {
        console.error("Failed to load document:", error);
        setStatus({ type: "error", message: "Could not load this document." });
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  /* Hide the status message after a few seconds */
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  /* Create or update */
  const handleSave = async () => {
    if (!title.trim()) {
      setStatus({ type: "error", message: "Add a title before saving." });
      return;
    }

    try {
      setSaving(true);

      if (documentId === null) {
        const response = await api.post("/documents", { title, content });
        setDocumentId(response.data.id);
        setStatus({ type: "success", message: "Document created." });
      } else {
        await api.put(`/documents/${documentId}`, { title, content });
        setStatus({ type: "success", message: "Changes saved." });
      }
    } catch (error) {
      console.error("Error saving document:", error);
      setStatus({ type: "error", message: "Could not save the document." });
    } finally {
      setSaving(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    if (documentId === null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await api.delete(`/documents/${documentId}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting document:", error);
      setStatus({ type: "error", message: "Could not delete the document." });
      setDeleting(false);
    }
  };

  /* Collaborate (WebSocket page comes later) */
const handleCollaborate = () => {
  if (documentId === null) return;

  // Collaboration is already active in the editor
  console.log("Collaboration enabled for document:", documentId);
};

  const isNew = documentId === null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-3">
          <button
            onClick={() => navigate("/dashboard")}
            aria-label="Back to dashboard"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Untitled document"
            aria-label="Document title"
            className="min-w-0 flex-1 basis-48 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-lg font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-200 focus:border-gray-300"
          />

          <div className="flex items-center gap-2">
            {status && (
              <span
                role="status"
                className={`mr-1 hidden text-sm sm:inline ${
                  status.type === "error" ? "text-red-600" : "text-gray-500"
                }`}
              >
                {status.message}
              </span>
            )}

<button
  onClick={handleCollaborate}
  disabled={isNew}
  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
>
  <Users className="h-4 w-4" />
  <span className="hidden sm:inline">Collaborate</span>
</button>

            <button
              onClick={handleDelete}
              disabled={isNew || deleting}
              aria-label="Delete document"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Delete</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : isNew ? "Save" : "Save changes"}
            </button>
          </div>
        </div>

        {/* Status on small screens */}
        {status && (
          <p
            role="status"
            className={`px-6 pb-2 text-sm sm:hidden ${
              status.type === "error" ? "text-red-600" : "text-gray-500"
            }`}
          >
            {status.message}
          </p>
        )}
      </header>

      {/* Editor */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="min-h-[60vh] rounded-xl border border-gray-200 bg-white p-6 text-gray-900 sm:p-10">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading document...
            </div>
          ) : (
            <TiptapEditor
              documentId={documentId!}
              userId={1}
              content={content}
              onChange={(content) => {
                setContent(content);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;
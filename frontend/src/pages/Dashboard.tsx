import {
  FilePlus,
  FolderOpen,
  FileText,
  RotateCcw,
  Trash2,
  Search,
  Clock,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import { useAuth } from "../hooks/useAuth";
import {
  getDocuments,
  getTrashDocuments,
  permanentlyDeleteDocument,
  restoreDocument,
} from "../api/documentApi";
import { type DocumentResponse } from "../types/document";
 

type View = "mine" | "shared" | "trash";

interface ViewConfig {
  title: string;
  subtitle: string;
  empty: string;
  hint: string;
  icon: typeof FileText;
}

const copy: Record<View, ViewConfig> = {
  mine: {
    title: "My documents",
    subtitle: "All your active workspaces and personal notes.",
    empty: "No documents yet",
    hint: "Create your first document to start writing and collaborating.",
    icon: FileText,
  },
  shared: {
    title: "Shared with me",
    subtitle: "Documents that teammates or friends have shared with you.",
    empty: "Nothing shared with you",
    hint: "When connections collaborate with you, their documents will appear here.",
    icon: Share2,
  },
  trash: {
    title: "Trash",
    subtitle: "Deleted files. Items can be restored or permanently removed.",
    empty: "Trash is empty",
    hint: "Documents you move to trash will wait here.",
    icon: Trash2,
  },
};

const Dashboard = ({ view = "mine" }: { view?: View }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { title, subtitle, empty, hint, icon: Icon } = copy[view];

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [trashDocuments, setTrashDocuments] = useState<DocumentResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePermanentDelete = async (id: number) => {
    const confirmed = window.confirm(
      "This will permanently delete the document. This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await permanentlyDeleteDocument(id);
      setTrashDocuments((current) =>
        current.filter((document) => document.id !== id)
      );
    } catch (error) {
      console.error("Failed to permanently delete document:", error);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreDocument(id);
      setTrashDocuments((current) =>
        current.filter((document) => document.id !== id)
      );
    } catch (error) {
      console.error("Failed to restore document:", error);
    }
  };


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        if (view === "mine") {
          const data = await getDocuments();
          setDocuments(data);
        } else if (view === "trash") {
          const data = await getTrashDocuments();
          setTrashDocuments(data);
        } else if (view === "shared") {
          // If a shared endpoint exists or filtered
          setDocuments([]);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [view]);

  const activeList = view === "trash" ? trashDocuments : documents;

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return activeList;
    const query = searchQuery.toLowerCase();
    return activeList.filter((doc) =>
      (doc.title || "Untitled document").toLowerCase().includes(query)
    );
  }, [activeList, searchQuery]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 antialiased">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {view === "mine" && user?.firstName
                  ? `Welcome back, ${user.firstName}. ${subtitle}`
                  : subtitle}
              </p>
            </div>
          </div>
        </div>

        {view === "mine" && (
          <button
            onClick={() => navigate("/documents/new")}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all duration-150 hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/35 active:scale-95"
          >
            <FilePlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>New document</span>
          </button>
        )}
      </div>

      {/* Quick Search & Filter Bar */}
      {activeList.length > 0 && (
        <div className="relative mt-8 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400"
          />
        </div>
      )}

      {/* Content Section */}
      <section className="mt-8">
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : activeList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 px-6 py-16 text-center backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <FolderOpen className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
              {empty}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {hint}
            </p>

            {view === "mine" && (
              <div className="mt-6">
                <button
                  onClick={() => navigate("/documents/new")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create a document</span>
                </button>
              </div>
            )}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No documents matched &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : view === "trash" ? (
          <div className="space-y-2.5">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
              >
                <div
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5"
                  onClick={() => navigate(`/documents/${document.id}`)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                    <Trash2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                      {document.title || "Untitled document"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="h-3 w-3" />
                      In Trash
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleRestore(document.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(document.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100/70 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete forever</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                onClick={() => navigate(`/documents/${document.id}`)}
                className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md dark:border-slate-800/90 dark:bg-slate-900/90 dark:hover:border-blue-500/40 dark:hover:shadow-lg dark:hover:shadow-black/20"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                      {document.title || "Untitled document"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="h-3 w-3" />
                      {document.updatedAt
                        ? new Date(document.updatedAt).toLocaleDateString()
                        : "Document"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

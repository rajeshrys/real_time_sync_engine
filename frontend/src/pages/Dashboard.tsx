import { FilePlus, FolderOpen,FileText,RotateCcw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useEffect,useState } from "react";
import { getDocuments,getTrashDocuments, permanentlyDeleteDocument,restoreDocument } from "../api/documentApi";
import {type DocumentResponse } from "../types/document";



type View = "mine" | "shared" | "trash";

const copy: Record<View, { title: string; empty: string; hint: string }> = {
  mine: {
    title: "My documents",
    empty: "No documents yet",
    hint: "Create your first document to start writing.",
  },
  shared: {
    title: "Shared with me",
    empty: "Nothing shared with you",
    hint: "Documents other people share with you will appear here.",
  },
  trash: {
    title: "Trash",
    empty: "Trash is empty",
    hint: "Deleted documents will appear here.",
  },
};

const Dashboard = ({ view = "mine" }: { view?: View }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { title, empty, hint } = copy[view];
  const [loading,setLoading] = useState(true);
  const [documents,setDocuments] = useState<DocumentResponse[]>([]);
  const [trashdocuments ,setTrashDocuments] = useState<DocumentResponse[]>([]);

  
    // for deleteing document permanently
    const handlePermanentDelete = async (id: number) => {

      const confirmed = window.confirm(
        "This will permanently delete the document. This action cannot be undone."
      );

      if (!confirmed) {
        return;
      }

      try {
        await permanentlyDeleteDocument(id);

        setTrashDocuments((current) =>
          current.filter((document) => document.id !== id)
        );
        navigate("/dashboard/trash");
      } catch (error) {
        console.error("Failed to permanently delete document:", error);
      }
    };

  // for restoring document
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
          }
        } catch (error) {
          console.error("Failed to fetch documents:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDocuments();
    }, [view]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>

          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {view === "mine" && (
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.firstName}.
            </p>
          )}
        </div>

        {view === "mine" && (
          <button
            onClick={() => navigate("/documents/new")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            <FilePlus className="h-4 w-4" />
            New document
          </button>
        )}
      </div>

        {/* checks whether the documents are there  */}
        {/* For myDocuments */}
      {view === "mine" && 
      <section className="mt-10">
        {loading ? (
           <p className="text-sm text-gray-500">
              Loading documents...
            </p>
        ): documents.length === 0 ? (
           <div className="rounded-xl border border-dashed border-gray-300 px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <FolderOpen className="h-7 w-7 text-gray-400" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                {empty}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {hint}
              </p>
            </div>
          )
        : (
          // checks the documents length is greater than 0 
            <div className="space-y-2">
              {documents.map((document) => (
                <button
                  key={document.id}
                  onClick={() => navigate(`/documents/${document.id}`)}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {document.title || "Untitled document"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Document
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

        </section>

      }

{/* for trash documents */}
      {view === "trash" && 
      <section>
            {loading ? (
           <p className="text-sm text-gray-500">
              Loading documents...
            </p>
        ): trashdocuments.length === 0 ? (
           <div className="rounded-xl border border-dashed border-gray-300 px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <FolderOpen className="h-7 w-7 text-gray-400" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-gray-900">
                {empty}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {hint}
              </p>
            </div>
          )
        : (
          // checks the documents length is greater than 0 
            <div className="space-y-2">
              {trashdocuments.map((document) => (
                <div
                  key={document.id}
                  onClick={() => navigate(`/documents/${document.id}`)}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left transition hover:bg-gray-50"
                >
                  {/* Document icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-900" />
                  </div>

                    {/* Document information */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {document.title || "Untitled document"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Deleted document
                    </p>
                  </div>
                   {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">

        {/* Restore */}
        <button
          onClick={() => handleRestore(document.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">
            Restore
          </span>
        </button>

        {/* Permanent delete */}
        <button
          onClick={() => handlePermanentDelete(document.id)}
          
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            Delete permanently
          </span>
        </button>

      </div>
                </div>
              ))}
            </div>
          )}
        
      </section>}
    </div>
  );
};

export default Dashboard;
import { FilePlus, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";



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

      {/* TODO: render the document list from the Document API; keep as empty state */}
      <section className="mt-10 rounded-xl border border-dashed border-gray-300 px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <FolderOpen className="h-7 w-7 text-gray-400" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-gray-900">{empty}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{hint}</p>
      </section>
    </div>
  );
};

export default Dashboard;
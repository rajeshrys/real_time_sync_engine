import { useNavigate } from "react-router-dom"
import TiptapEditor from "../components/TiptapEditor"
import { useState } from "react"
import { Cone } from "lucide-react"
import Paragraph from "@tiptap/extension-paragraph"
import api from "../api/axios"
import { createDocument,updateDocument} from "../api/documentApi"

const DocumentEditor = () => {
    const navigate = useNavigate()
    const [title,settitle] =useState("");
    const [content,setcontent] = useState<object | null>(null);
    const [saving, setSaving] = useState(false);
    const [documentId, setDocumentId] = useState<number | null>(null);

    const handleSave = async () => {

    if (documentId === null) {

        // First save → CREATE
        const response = await api.post("/documents", {
            title,
            content
        });

        // Very important
        setDocumentId(response.data.id);

    } else {

        // Subsequent saves → UPDATE
        await api.put(`/documents/${documentId}`, {
            title,
            content
        });
    }
};

  return (
    <div className="min-h-screen bg-gray-600">
            {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 bg-white text-black rounded-2xl">
          <input
          value={title}
          onChange={(e)=>settitle(e.target.value)}
            type="text"
            placeholder="Untitled document"
            className="w-full max-w-md border-none text-xl font-semibold outline-none"
          />
          <div className="flex flex-row gap-3">
            <button 
            onClick={handleSave}
            disabled={saving}

            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white cursor-pointer active:scale-90"
          >
            {saving? "saving..." : "save"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white cursor-pointer active:scale-90"
          >
            Back
          </button>
          </div>
        </div>

      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        T<TiptapEditor onChange={setcontent} />
      </main>
    </div>
  )
}

export default DocumentEditor

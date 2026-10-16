import { useNavigate } from "react-router-dom"
import TiptapEditor from "../components/TiptapEditor"
import { useState } from "react"


const DocumentEditor = () => {
    const navigate = useNavigate()
    const [title,settitle] =useState("");
    const [content,setcontent] = useState<object | null>(null);

    const handleSave= async()=>{
      const document= {
        title,
        content
      }
      console.log(document);
    }

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
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white cursor-pointer active:scale-90"
          >
            Save
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

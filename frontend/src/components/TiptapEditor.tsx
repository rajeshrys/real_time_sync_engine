import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TipTapEditorProps {
  onChange: (content: object) => void;
}


const TiptapEditor = ({onChange}: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],

    content: "<p>Start writing...</p>",
    editorProps:{
        attributes: {
            class: "focus:outline-none h-full p-4"
        }
    },
    onUpdate:({editor})=>{
      onChange(editor.getJSON());
    }
  });

  if (!editor) {
    return null;
  }

return (
    <div className="min-h-full w-full rounded-lg border border-gray-300 bg-white text-black flex flex-col">
      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto [&_.ProseMirror]:min-h-screen [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none"
      />
    </div>
  );
};

export default TiptapEditor;
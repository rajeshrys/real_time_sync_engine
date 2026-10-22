import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";

import {
  connectToDocument,
  sendDocumentChange,
  disconnectWebSocket,
} from "../services/websocket";

interface TipTapEditorProps {
  content?: object | null;
  onChange: (content: object) => void;
  documentId: number;
  userId?: number;
  editable: boolean;
}

const TiptapEditor = ({
  content,
  onChange,
  documentId,
  userId,
  editable = true,
}: TipTapEditorProps) => {
  // Used to identify changes coming from another user
  const isRemoteUpdate = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your document...</p>",
    editable,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[500px] p-6 text-slate-800 dark:text-slate-100 leading-relaxed text-base",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);

      if (isRemoteUpdate.current) {
        return;
      }

      sendDocumentChange(documentId, json, userId);
    },
  });

  // Keep editable state synced
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  /* Load the document content from the backend */
  useEffect(() => {
    if (!editor || !content) return;

    isRemoteUpdate.current = true;
    editor.commands.setContent(content);
    isRemoteUpdate.current = false;
  }, [editor, content]);

  /* Connect to WebSocket when document opens */
  useEffect(() => {
    if (!editor || !documentId) return;

    connectToDocument(documentId, (message) => {
      if (message.userId === userId) return;

      if (message.type === "CONTENT_UPDATE" && message.content) {
        isRemoteUpdate.current = true;
        editor.commands.setContent(message.content);
        isRemoteUpdate.current = false;
      }
    });

    return () => {
      disconnectWebSocket();
    };
  }, [editor, documentId, userId]);

  if (!editor) {
    return null;
  }

  const toolBtnClass = (isActive: boolean) =>
    `inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    }`;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/90">
      {/* Formatting Toolbar */}
      {editable && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-slate-200/80 bg-white/95 px-4 py-2 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/95 rounded-t-2xl">
          {/* Text format */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={toolBtnClass(editor.isActive("bold"))}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={toolBtnClass(editor.isActive("italic"))}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={toolBtnClass(editor.isActive("strike"))}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={toolBtnClass(editor.isActive("code"))}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={toolBtnClass(editor.isActive("heading", { level: 1 }))}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={toolBtnClass(editor.isActive("heading", { level: 2 }))}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={toolBtnClass(editor.isActive("heading", { level: 3 }))}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={toolBtnClass(editor.isActive("bulletList"))}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={toolBtnClass(editor.isActive("orderedList"))}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={toolBtnClass(editor.isActive("blockquote"))}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={toolBtnClass(false)}
            title="Horizontal Divider"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={toolBtnClass(false)}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className={toolBtnClass(false)}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
        className="flex-1 overflow-y-auto"
      />
    </div>
  );
};

export default TiptapEditor;

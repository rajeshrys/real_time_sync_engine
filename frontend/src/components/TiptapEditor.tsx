import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

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
}

const TiptapEditor = ({
  content,
  onChange,
  documentId,
  userId,
}: TipTapEditorProps) => {

  // Used to identify changes coming from another user
  const isRemoteUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],

    content: "<p>Start writing...</p>",

    editorProps: {
      attributes: {
        class: "focus:outline-none h-full p-4",
      },
    },

    onUpdate: ({ editor }) => {

      const json = editor.getJSON();

      // Always notify parent
      onChange(json);

      // Don't send remote changes back through WebSocket
      if (isRemoteUpdate.current) {
        return;
      }

      // Send local changes to other collaborators
      sendDocumentChange(
        documentId,
        json,
        userId
      );
    },
  });

  /*
   * Load the document content from the backend
   */
  useEffect(() => {

    if (!editor || !content) {
      return;
    }

    isRemoteUpdate.current = true;

    editor.commands.setContent(content);

    isRemoteUpdate.current = false;

  }, [editor, content]);


  /*
   * Connect to WebSocket when document opens
   */
  useEffect(() => {

    if (!editor || !documentId) {
      return;
    }

    console.log(
      "Connecting to document:",
      documentId
    );

    connectToDocument(
      documentId,

      (message) => {

        console.log(
          "Received collaboration message:",
          message
        );

        // Ignore our own message
        if (message.userId === userId) {
          return;
        }

        if (
          message.type === "CONTENT_UPDATE"
          && message.content
        ) {

          isRemoteUpdate.current = true;

          editor.commands.setContent(
            message.content
          );

          isRemoteUpdate.current = false;
        }
      }
    );

    return () => {

      console.log(
        "Disconnecting from document:",
        documentId
      );

      disconnectWebSocket();

    };

  }, [editor, documentId, userId]);


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
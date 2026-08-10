"use client";

import { Bold, Italic, Heading2, Heading3, Link, Image } from "lucide-react";
import type { EditorView } from "@codemirror/view";

interface EditorToolbarProps {
  editorView: EditorView | null;
  onImagePicker: () => void;
}

function wrapSelection(view: EditorView, before: string, after: string) {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  view.dispatch({
    changes: { from, to, insert: `${before}${selected || "text"}${after}` },
    selection: { anchor: from + before.length, head: from + before.length + (selected.length || 4) },
  });
  view.focus();
}

function insertAtCursor(view: EditorView, text: string) {
  const { from } = view.state.selection.main;
  view.dispatch({ changes: { from, insert: text } });
  view.focus();
}

const btnCls = "p-1.5 rounded-md hover:bg-accent-light hover:text-accent text-muted transition-colors";

export function EditorToolbar({ editorView, onImagePicker }: EditorToolbarProps) {
  if (!editorView) return null;

  const actions = [
    { icon: Bold, title: "Bold (Ctrl+B)", action: () => wrapSelection(editorView, "**", "**") },
    { icon: Italic, title: "Italic (Ctrl+I)", action: () => wrapSelection(editorView, "*", "*") },
    { icon: Heading2, title: "Heading 2", action: () => insertAtCursor(editorView, "\n## ") },
    { icon: Heading3, title: "Heading 3", action: () => insertAtCursor(editorView, "\n### ") },
    { icon: Link, title: "Link (Ctrl+K)", action: () => wrapSelection(editorView, "[", "](url)") },
    { icon: Image, title: "Image from library", action: onImagePicker },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-background rounded-t-xl">
      {actions.map(({ icon: Icon, title, action }) => (
        <button key={title} type="button" title={title} onClick={action} className={btnCls}>
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { EditorView, keymap, placeholder as cmPlaceholder } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { defaultKeymap } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "next-themes";
import { EditorToolbar } from "./editor-toolbar";
import { MarkdownPreview } from "./markdown-preview";
import { MediaLibrary } from "./media-library";
import { Modal } from "@/components/ui/modal";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [view, setView] = useState<EditorView | null>(null);
  const [preview, setPreview] = useState(value);
  const [showMedia, setShowMedia] = useState(false);
  const { resolvedTheme } = useTheme();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const createEditor = useCallback(() => {
    if (!containerRef.current) return;
    // Destroy existing
    viewRef.current?.destroy();

    const extensions = [
      markdown(),
      keymap.of(defaultKeymap),
      cmPlaceholder("Noi dung bai viet (Markdown)..."),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const doc = update.state.doc.toString();
          onChangeRef.current(doc);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setPreview(doc), 300);
        }
      }),
    ];

    if (resolvedTheme === "dark") {
      extensions.push(oneDark);
    }

    const state = EditorState.create({ doc: value, extensions });
    const ev = new EditorView({ state, parent: containerRef.current });
    viewRef.current = ev;
    setView(ev);
  }, [resolvedTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    createEditor();
    return () => viewRef.current?.destroy();
  }, [createEditor]);

  function handleImageInsert(url: string) {
    if (viewRef.current) {
      const { from } = viewRef.current.state.selection.main;
      viewRef.current.dispatch({ changes: { from, insert: `![](${url})` } });
      viewRef.current.focus();
    }
    setShowMedia(false);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border rounded-xl overflow-hidden">
        {/* Editor pane */}
        <div className="flex flex-col min-h-[300px] border-r border-border">
          <EditorToolbar editorView={view} onImagePicker={() => setShowMedia(true)} />
          <div ref={containerRef} className="flex-1 overflow-auto [&_.cm-editor]:h-full [&_.cm-editor]:outline-none [&_.cm-scroller]:min-h-[260px] [&_.cm-content]:p-3 [&_.cm-content]:text-sm [&_.cm-content]:font-mono" />
        </div>

        {/* Preview pane */}
        <div className="p-4 overflow-auto max-h-[500px] bg-surface">
          <p className="text-xs text-muted font-semibold mb-3 uppercase tracking-wider">Xem truoc</p>
          <MarkdownPreview content={preview} />
        </div>
      </div>

      {/* Media picker modal */}
      {showMedia && (
        <Modal onClose={() => setShowMedia(false)} title="Chon anh" wide>
          <MediaLibrary onInsert={handleImageInsert} />
        </Modal>
      )}
    </div>
  );
}

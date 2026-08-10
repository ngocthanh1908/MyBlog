# Phase B: Markdown Editor with Live Preview

**Priority:** HIGH | **Status:** pending | **Depends on:** Phase A (media picker)

## Overview
Replace raw textarea in article form with split-pane Markdown editor: CodeMirror on left, react-markdown preview on right. Toolbar for formatting + image insertion from media library.

## Key Insights
- Current editor is plain `<textarea>` with `font-mono` class
- Content is Markdown/MDX, rendered via `compileMDX` on blog detail page
- Need CodeMirror for syntax highlighting + keyboard shortcuts
- Preview should match blog detail rendering closely

## Requirements
### Functional
- Split-pane: CodeMirror editor left, live preview right
- Toolbar: Bold, Italic, Heading (H2/H3), Link, Image (from media library)
- Keyboard shortcuts: Ctrl+B, Ctrl+I, Ctrl+K (link)
- Dark mode theme sync
- Mobile: stack panes vertically
- Autosave draft to localStorage every 30s

### Non-functional
- Lazy load CodeMirror (~80KB gzipped)
- Debounce preview rendering (300ms)
- Preserve cursor position on re-render

## Architecture
```
ArticleForm
  └── MarkdownEditor (lazy loaded)
        ├── EditorToolbar (formatting buttons + media picker trigger)
        ├── CodeMirror (left pane)
        └── MarkdownPreview (right pane, react-markdown + remark-gfm)
```

## Dependencies (new packages)
- `@codemirror/view`, `@codemirror/state`, `@codemirror/lang-markdown`
- `@codemirror/theme-one-dark` (dark mode)
- `react-markdown`, `remark-gfm`

## Related Code Files
### Modify
- `src/components/admin/article-form.tsx` — replace textarea with MarkdownEditor
- `package.json` — add CodeMirror + react-markdown deps

### Create
- `src/components/admin/markdown-editor.tsx` — main editor component
- `src/components/admin/editor-toolbar.tsx` — formatting toolbar
- `src/components/admin/markdown-preview.tsx` — preview pane

## Implementation Steps
1. Install CodeMirror + react-markdown packages
2. Create `markdown-preview.tsx` — react-markdown with remark-gfm, prose styling
3. Create `editor-toolbar.tsx` — formatting buttons, media picker trigger
4. Create `markdown-editor.tsx` — split pane with CodeMirror + preview
5. Replace textarea in `article-form.tsx` with lazy-loaded MarkdownEditor
6. Add dark mode theme switching
7. Add autosave to localStorage
8. Test editor interactions

## Todo
- [ ] Install dependencies
- [ ] Markdown preview component
- [ ] Editor toolbar component
- [ ] Main markdown editor with CodeMirror
- [ ] Integration into article form
- [ ] Dark mode theme sync
- [ ] Autosave draft
- [ ] Mobile responsive stacking

## Success Criteria
- Can write Markdown with syntax highlighting
- Live preview updates as you type
- Toolbar inserts formatting at cursor
- Image button opens media library picker
- Dark mode works
- Mobile-friendly stacked layout

## Risk Assessment
- Bundle size: lazy load entire editor, code-split from main admin chunk
- CodeMirror SSR: must be client-only (dynamic import with ssr: false)

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchResult {
  id: string;
  url: string;
  meta?: { title?: string };
  excerpt?: string;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pagefindRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      if (!pagefindRef.current) {
        // Use indirect eval to prevent Turbopack/Vite from resolving the import
        const loadPagefind = new Function('return import("/pagefind/pagefind.js")');
        pagefindRef.current = await loadPagefind();
        await pagefindRef.current.init();
      }

      const search = await pagefindRef.current.search(term);
      const loaded = await Promise.all(
        search.results.slice(0, 8).map((r: { data: () => Promise<SearchResult> }) => r.data())
      );
      setResults(loaded);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(value), 300);
  }

  return (
    <div ref={containerRef} className="relative mb-8">
      <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 shadow-[var(--card-shadow)] focus-within:border-accent transition-colors">
        <Search className="w-5 h-5 text-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Tim kiem bai viet..."
          className="bg-transparent w-full outline-none text-primary placeholder:text-muted/50 text-[0.95rem]"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-muted text-sm">Khong tim thay ket qua</p>
          ) : (
            results.map((r) => (
              <a
                key={r.id}
                href={r.url}
                className="block px-4 py-3 hover:bg-accent/10 border-b border-border last:border-b-0 no-underline transition-colors"
              >
                <div className="font-semibold text-primary text-[0.92rem]">
                  {r.meta?.title || "Untitled"}
                </div>
                {r.excerpt && (
                  <p
                    className="text-muted text-[0.82rem] mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      // Pagefind excerpts contain <mark> tags for highlights — strip all other HTML
                      __html: r.excerpt.replace(/<(?!\/?mark\b)[^>]*>/gi, ""),
                    }}
                  />
                )}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

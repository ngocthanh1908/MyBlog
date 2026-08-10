import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "blog.sqlite");

let db: Database.Database | null = null;

/** Lazy-init singleton SQLite connection */
function getDb(): Database.Database {
  if (db) return db;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      ip TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      window_start TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (ip, endpoint)
    );
    CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      content TEXT NOT NULL DEFAULT '',
      cover_image TEXT DEFAULT NULL,
      draft INTEGER NOT NULL DEFAULT 0,
      read_time INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts(draft);
  `);

  return db;
}

export type DbPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  content: string;
  cover_image: string | null;
  draft: number;
  read_time: number;
  created_at: string;
  updated_at: string;
};

export type CreatePostInput = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  content: string;
  cover_image?: string;
  draft?: boolean;
  read_time?: number;
};

export type UpdatePostInput = Partial<CreatePostInput>;

export function getAllDbPosts(includeDrafts = false): DbPost[] {
  const d = getDb();
  if (includeDrafts) {
    return d.prepare("SELECT * FROM posts ORDER BY created_at DESC").all() as DbPost[];
  }
  return d.prepare("SELECT * FROM posts WHERE draft = 0 ORDER BY created_at DESC").all() as DbPost[];
}

export function getDbPostById(id: number): DbPost | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE id = ?").get(id) as DbPost | undefined;
}

export function getDbPostBySlug(slug: string): DbPost | undefined {
  return getDb().prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as DbPost | undefined;
}

export function createDbPost(input: CreatePostInput): DbPost {
  const d = getDb();
  const result = d.prepare(`
    INSERT INTO posts (title, slug, excerpt, tags, content, cover_image, draft, read_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.title,
    input.slug,
    input.excerpt,
    JSON.stringify(input.tags),
    input.content,
    input.cover_image ?? null,
    input.draft ? 1 : 0,
    input.read_time ?? 1,
  );
  return getDbPostById(Number(result.lastInsertRowid))!;
}

export function updateDbPost(id: number, input: UpdatePostInput): DbPost | undefined {
  const existing = getDbPostById(id);
  if (!existing) return undefined;

  const d = getDb();
  d.prepare(`
    UPDATE posts SET
      title = ?, slug = ?, excerpt = ?, tags = ?, content = ?,
      cover_image = ?, draft = ?, read_time = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    input.title ?? existing.title,
    input.slug ?? existing.slug,
    input.excerpt ?? existing.excerpt,
    input.tags ? JSON.stringify(input.tags) : existing.tags,
    input.content ?? existing.content,
    input.cover_image ?? existing.cover_image,
    input.draft !== undefined ? (input.draft ? 1 : 0) : existing.draft,
    input.read_time ?? existing.read_time,
    id,
  );
  return getDbPostById(id);
}

export function deleteDbPost(id: number): boolean {
  const result = getDb().prepare("DELETE FROM posts WHERE id = ?").run(id);
  return result.changes > 0;
}

/** Get all distinct tags with post counts */
export function getAllDbTags(): { name: string; count: number }[] {
  const posts = getAllDbPosts(true);
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    const tags: string[] = JSON.parse(post.tags);
    for (const tag of tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Rename tag across all posts (transaction) */
export function renameDbTag(oldName: string, newName: string): number {
  const d = getDb();
  const rename = d.transaction(() => {
    const posts = d.prepare("SELECT id, tags FROM posts").all() as Pick<DbPost, "id" | "tags">[];
    let changed = 0;
    for (const post of posts) {
      const tags: string[] = JSON.parse(post.tags);
      const idx = tags.indexOf(oldName);
      if (idx === -1) continue;
      tags[idx] = newName;
      // Deduplicate in case newName already exists
      const unique = [...new Set(tags)];
      d.prepare("UPDATE posts SET tags = ?, updated_at = datetime('now') WHERE id = ?")
        .run(JSON.stringify(unique), post.id);
      changed++;
    }
    return changed;
  });
  return rename();
}

/** Remove tag from all posts (transaction) */
export function deleteDbTag(tagName: string): number {
  const d = getDb();
  const remove = d.transaction(() => {
    const posts = d.prepare("SELECT id, tags FROM posts").all() as Pick<DbPost, "id" | "tags">[];
    let changed = 0;
    for (const post of posts) {
      const tags: string[] = JSON.parse(post.tags);
      if (!tags.includes(tagName)) continue;
      const filtered = tags.filter((t) => t !== tagName);
      d.prepare("UPDATE posts SET tags = ?, updated_at = datetime('now') WHERE id = ?")
        .run(JSON.stringify(filtered), post.id);
      changed++;
    }
    return changed;
  });
  return remove();
}

/**
 * Check rate limit. Returns true if allowed, false if exceeded.
 * Cleans up expired entries on each call.
 */
export function checkRateLimit(ip: string, endpoint: string, maxAttempts: number, windowSeconds: number): boolean {
  const d = getDb();
  // Cleanup expired entries
  d.prepare("DELETE FROM rate_limits WHERE datetime(window_start, '+' || ? || ' seconds') < datetime('now')")
    .run(windowSeconds);

  // Atomic upsert: insert or increment count, return resulting count
  const result = d.prepare(`
    INSERT INTO rate_limits (ip, endpoint, count) VALUES (?, ?, 1)
    ON CONFLICT(ip, endpoint) DO UPDATE SET count = count + 1
    RETURNING count
  `).get(ip, endpoint) as { count: number };

  return result.count <= maxAttempts;
}

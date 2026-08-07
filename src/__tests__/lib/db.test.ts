import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";

// Test DB helpers using in-memory SQLite directly (same schema as db.ts)
function createTestDb() {
  const db = new Database(":memory:");
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
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

describe("SQLite DB operations", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it("inserts and retrieves a post", () => {
    const stmt = db.prepare(
      "INSERT INTO posts (title, slug, excerpt, tags, content) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run("Test Post", "test-post", "An excerpt", '["tech"]', "# Hello");

    const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get("test-post") as Record<string, unknown>;
    expect(post).toBeDefined();
    expect(post.title).toBe("Test Post");
    expect(post.slug).toBe("test-post");
    expect(JSON.parse(post.tags as string)).toEqual(["tech"]);
  });

  it("rejects duplicate slugs", () => {
    const stmt = db.prepare("INSERT INTO posts (title, slug) VALUES (?, ?)");
    stmt.run("Post 1", "same-slug");
    expect(() => stmt.run("Post 2", "same-slug")).toThrow();
  });

  it("filters drafts", () => {
    const stmt = db.prepare("INSERT INTO posts (title, slug, draft) VALUES (?, ?, ?)");
    stmt.run("Published", "published", 0);
    stmt.run("Draft", "draft-post", 1);

    const published = db.prepare("SELECT * FROM posts WHERE draft = 0").all();
    expect(published).toHaveLength(1);

    const all = db.prepare("SELECT * FROM posts").all();
    expect(all).toHaveLength(2);
  });

  it("updates a post", () => {
    db.prepare("INSERT INTO posts (title, slug) VALUES (?, ?)").run("Original", "my-post");
    db.prepare("UPDATE posts SET title = ? WHERE slug = ?").run("Updated", "my-post");

    const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get("my-post") as Record<string, unknown>;
    expect(post.title).toBe("Updated");
  });

  it("deletes a post", () => {
    db.prepare("INSERT INTO posts (title, slug) VALUES (?, ?)").run("To Delete", "delete-me");
    const result = db.prepare("DELETE FROM posts WHERE slug = ?").run("delete-me");
    expect(result.changes).toBe(1);

    const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get("delete-me");
    expect(post).toBeUndefined();
  });

  it("handles tags JSON serialization", () => {
    const tags = ["sap", "ai", "running"];
    db.prepare("INSERT INTO posts (title, slug, tags) VALUES (?, ?, ?)").run("Tagged", "tagged", JSON.stringify(tags));

    const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get("tagged") as Record<string, unknown>;
    expect(JSON.parse(post.tags as string)).toEqual(tags);
  });
});

"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { MediaLibrary } from "./media-library";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

interface CoverImageFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** The site CSP only allows same-origin images, so only paths starting with "/" can be shown. */
const isLocalPath = (src: string) => src.startsWith("/") && !src.startsWith("//") && !src.includes("\\");
const isExternal = (src: string) => /^(https?:)?\/\//i.test(src);

const buttonCls =
  "shrink-0 px-3.5 py-2 rounded-xl border border-border text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50";

/**
 * Cover image control: 16:9 preview, path input, upload, pick from the media library, remove.
 * Replaces the bare URL input so authors can see what readers will see.
 */
export function CoverImageField({ value, onChange }: CoverImageFieldProps) {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [picking, setPicking] = useState(false);
  const [previewFailed, setPreviewFailed] = useState<string | null>(null);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Tải ảnh thất bại");
      onChange(data.url);
      showToast("Đã tải ảnh lên", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi tải ảnh", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const canPreview = value !== "" && isLocalPath(value) && previewFailed !== value;

  return (
    <div>
      <div className="flex gap-2">
        <input
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/ten-anh.webp"
        />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={buttonCls}>
          {uploading ? "Đang tải..." : "Tải lên"}
        </button>
        <button type="button" onClick={() => setPicking(true)} className={buttonCls}>
          Chọn từ thư viện
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className={buttonCls}>
            Bỏ ảnh
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {isExternal(value) && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          Ảnh từ trang ngoài sẽ không hiển thị (chính sách bảo mật của site chỉ cho ảnh của chính site). Hãy tải ảnh lên hoặc chọn từ thư viện.
        </p>
      )}

      <div className="mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-dashed border-border bg-accent-light">
        {canPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Xem trước ảnh bìa"
            className="h-full w-full object-cover"
            onError={() => setPreviewFailed(value)}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted">
            {value && previewFailed === value ? "Không tải được ảnh này" : "Chưa có ảnh bìa (tỉ lệ 16:9)"}
          </div>
        )}
      </div>

      {picking && (
        <Modal
          onClose={() => setPicking(false)}
          title="Chọn ảnh bìa"
          wide
        >
          <MediaLibrary
            onInsert={(url) => {
              onChange(url);
              setPicking(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Badge } from "../ui/Badge";

export interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
  sublabel?: string;
}

const ImagePreviewCard: React.FC<{
  url: string;
  index: number;
  maxFiles: number;
  onRemove: () => void;
}> = ({ url, index, maxFiles, onRemove }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className="relative group rounded-lg overflow-hidden border border-border-warm bg-surface h-32 sm:h-36 flex flex-col items-center justify-center shadow-2xs"
    >
      {!imageError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={`Uploaded ${index + 1}`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-center bg-[#f6e0ce]/30 w-full h-full">
          <UploadCloud className="w-6 h-6 text-primary/60 mb-1" />
          <span className="text-[10px] font-mono text-rose-600 font-bold">Invalid Image Path</span>
          <span className="text-[9px] font-mono text-ink-muted truncate max-w-[140px]">{url}</span>
        </div>
      )}

      <div className="absolute top-2 left-2 z-10">
        <Badge variant="accent" size="sm">
          WebP {maxFiles === 1 ? "Thumbnail" : `#${index + 1}`}
        </Badge>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors cursor-pointer z-10"
        title="Remove image"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = [],
  onChange,
  maxFiles = 3,
  label,
  sublabel,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validUrls = value.filter(
    (url) => url && url.trim().length > 0 && url !== "/projects/preview.jpg"
  );

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    const selectedFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));

    if (selectedFiles.length === 0) {
      setError("Please select valid image files.");
      return;
    }

    if (validUrls.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} image(s) allowed.`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (data.success && data.urls) {
        onChange([...validUrls, ...data.urls]);
      } else {
        setError(data.error || "Failed to upload images.");
      }
    } catch {
      setUploading(false);
      setError("Network error uploading images.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = validUrls.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const displayLabel = label || `Project Showcase Images (Max ${maxFiles})`;
  const displaySublabel = sublabel || "/ 画像アップロード (WebP)";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-ink flex items-center gap-1.5 truncate">
          <span className="truncate">{displayLabel}</span>
          <span className="text-primary font-serif font-bold text-[11px] shrink-0">{displaySublabel}</span>
        </label>
        <span className="text-xs font-mono text-ink-muted shrink-0 ml-2">
          {validUrls.length} / {maxFiles}
        </span>
      </div>

      {/* Drag & Drop Zone Box */}
      {validUrls.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-1.5 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border-warm bg-paper hover:border-primary/50 hover:bg-surface"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={maxFiles > 1}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center space-y-1.5 py-2">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-[11px] font-mono text-ink-muted">
                Converting to WebP...
              </span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-[#f6e0ce]/50 text-primary flex items-center justify-center border border-border-warm">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ink">
                  Drag &amp; Drop {maxFiles === 1 ? "thumbnail" : `${maxFiles} images`} here, or{" "}
                  <span className="text-primary underline">browse</span>
                </p>
                <p className="text-[10px] font-mono text-ink-muted">
                  Auto converted to WebP format.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs font-mono text-rose-600">{error}</p>}

      {/* Image Preview Grid */}
      {validUrls.length > 0 && (
        <div className={`grid gap-3 pt-1 ${maxFiles === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
          {validUrls.map((url, idx) => (
            <ImagePreviewCard
              key={url + idx}
              url={url}
              index={idx}
              maxFiles={maxFiles}
              onRemove={() => handleRemove(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

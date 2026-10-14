"use client";

import React, { useState, useRef } from "react";
import {
  UploadSimple,
  Link as LinkIcon,
  Database,
  FolderSimple,
  Trash,
  Check,
  Image as ImageIcon,
} from "@phosphor-icons/react";

interface ImagePickerFieldProps {
  label: string;
  badge?: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: "16/9" | "4/5" | "square" | "contain";
  placeholder?: string;
  previewContain?: boolean;
}

/**
 * Compresses an image client-side to keep MongoDB documents under size limits
 * and maximize rendering performance.
 */
async function compressImageToDataUrl(file: File, maxDim = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an SVG, load text directly
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(reader.result as string);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Prefer WebP for optimal compression
      const mime = file.type === "image/png" ? "image/png" : "image/webp";
      const compressedDataUrl = canvas.toDataURL(mime, quality);
      resolve(compressedDataUrl);
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImagePickerField({
  label,
  badge,
  value,
  onChange,
  aspectRatio = "16/9",
  placeholder = "https://... or /images/...",
  previewContain = false,
}: ImagePickerFieldProps) {
  // Mode: "device" | "link"
  const isDataUri = value?.startsWith("data:image");
  const isUploadPath = value?.startsWith("/uploads/");
  const [mode, setMode] = useState<"device" | "link">(
    isDataUri || isUploadPath ? "device" : "link"
  );
  // Storage destination for device upload: "database" (Data URI) | "codebase" (/uploads/...)
  const [storeTarget, setStoreTarget] = useState<"database" | "codebase">("database");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine current image source origin
  const getSourceTag = () => {
    if (!value) return null;
    if (value.startsWith("data:image")) return { label: "IN DATABASE (BASE64)", color: "text-[#A5B4FC] bg-[#A5B4FC]/10 border-[#A5B4FC]/30" };
    if (value.startsWith("/uploads/")) return { label: "IN CODEBASE (/UPLOADS)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    if (value.startsWith("/")) return { label: "LOCAL ASSET", color: "text-white/60 bg-white/5 border-white/15" };
    return { label: "ONLINE LINK", color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
  };

  const sourceTag = getSourceTag();

  const handleDeviceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);

    try {
      if (storeTarget === "database") {
        // Save directly into MongoDB as compressed Data URI
        const dataUrl = await compressImageToDataUrl(file);
        onChange(dataUrl);
      } else {
        // Upload to server and save in public/uploads/
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          onChange(data.publicUrl);
        } else {
          setUploadError(data.error || "Upload failed");
        }
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const aspectClass =
    aspectRatio === "4/5"
      ? "aspect-[4/5]"
      : aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "contain"
      ? "h-48"
      : "aspect-[16/9]";

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Label and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-white/60 uppercase tracking-widest text-[11px] font-bold">
            {label}
          </label>
          {badge && (
            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">
              {badge}
            </span>
          )}
        </div>

        {/* Tab Switcher: Device File vs Online Link */}
        <div className="inline-flex items-center rounded-lg bg-black/50 border border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => setMode("device")}
            className={`min-h-[28px] px-2.5 rounded-md text-[10px] tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "device"
                ? "bg-white text-black font-bold shadow-sm"
                : "text-white/40 hover:text-white"
            }`}
          >
            <UploadSimple size={12} weight="bold" />
            <span>Upload Device</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`min-h-[28px] px-2.5 rounded-md text-[10px] tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "link"
                ? "bg-white text-black font-bold shadow-sm"
                : "text-white/40 hover:text-white"
            }`}
          >
            <LinkIcon size={12} weight="bold" />
            <span>Online Link</span>
          </button>
        </div>
      </div>

      {/* Input Mode 1: Device Upload */}
      {mode === "device" && (
        <div className="space-y-3">
          {/* Storage Destination Toggle */}
          <div className="flex items-center justify-between text-[10px] px-1 text-white/50">
            <span>Destination:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStoreTarget("database")}
                className={`cursor-pointer transition-colors flex items-center gap-1 px-2 py-0.5 rounded border ${
                  storeTarget === "database"
                    ? "border-[#A5B4FC]/40 text-[#A5B4FC] bg-[#A5B4FC]/10"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
                title="Embeds directly inside MongoDB Atlas document as Base64 Data URI"
              >
                <Database size={11} />
                <span>Save in Database</span>
              </button>
              <button
                type="button"
                onClick={() => setStoreTarget("codebase")}
                className={`cursor-pointer transition-colors flex items-center gap-1 px-2 py-0.5 rounded border ${
                  storeTarget === "codebase"
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
                title="Saves to public/uploads/ in project codebase"
              >
                <FolderSimple size={11} />
                <span>Save to Codebase</span>
              </button>
            </div>
          </div>

          {/* Upload Button / Dropzone */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDeviceFile}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full min-h-[46px] border border-dashed border-white/20 hover:border-[#A5B4FC] hover:bg-white/[0.02] rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-white/70 hover:text-white transition-all cursor-pointer group disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#A5B4FC] border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] text-[#A5B4FC]">
                  {storeTarget === "database" ? "Encoding & Compressing for Database..." : "Uploading to Server..."}
                </span>
              </>
            ) : (
              <>
                <UploadSimple size={16} className="text-[#A5B4FC] group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[11px]">
                  Choose Image from Device (JPG, PNG, WEBP, SVG)
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Input Mode 2: Online Link / File Path */}
      {mode === "link" && (
        <div className="relative">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#A5B4FC] transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[30px] min-w-[30px] flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
              title="Clear Image"
            >
              <Trash size={13} />
            </button>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-red-400 text-[11px] text-center anim-fade-in">{uploadError}</p>
      )}

      {/* Live Preview & Meta Pill */}
      {value ? (
        <div className={`w-full ${aspectClass} rounded-xl overflow-hidden bg-black/60 border border-white/10 relative group`}>
          <img
            src={value}
            alt="Asset preview"
            className={`w-full h-full ${previewContain ? "object-contain p-2" : "object-cover"} transition-transform group-hover:scale-[1.01]`}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Source Tag Badge */}
          {sourceTag && (
            <span
              className={`absolute top-2 left-2 text-[9px] font-mono tracking-wider px-2 py-0.5 rounded border backdrop-blur-md ${sourceTag.color}`}
            >
              {sourceTag.label}
            </span>
          )}

          {/* Quick Remove Button */}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 min-h-[28px] px-2 rounded-lg bg-black/80 hover:bg-red-500/80 text-white/60 hover:text-white text-[10px] font-mono border border-white/15 flex items-center gap-1 transition-colors cursor-pointer"
            title="Remove Image"
          >
            <Trash size={11} />
            <span>REMOVE</span>
          </button>
        </div>
      ) : (
        <div className={`w-full ${aspectClass} rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center text-white/20 gap-2`}>
          <ImageIcon size={24} weight="thin" />
          <span className="text-[10px] uppercase tracking-wider">No Image Configured</span>
        </div>
      )}
    </div>
  );
}

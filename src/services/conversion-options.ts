export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

export interface ConversionOptions {
  quality?: number;
  maxEdge?: number;
  onProgress?: (completed: number, total: number) => void;
}

export function fittedDimensions(width: number, height: number, maxEdge = 0) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("The photo has invalid dimensions");
  }
  const scale = maxEdge > 0 ? Math.min(1, maxEdge / Math.max(width, height)) : 1;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function outputFilename(sourceName: string, extension: string, used: Set<string>): string {
  const stem = sourceName.replace(/\.[^.]*$/, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/^\.+/, "").trim() || "image";
  let name = `${stem}.${extension}`;
  let suffix = 2;
  while (used.has(name.toLowerCase())) name = `${stem}_${suffix++}.${extension}`;
  used.add(name.toLowerCase());
  return name;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

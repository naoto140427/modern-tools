// "ocr" や "video", "dev" を追加しています
export type Mode = "image" | "pdf" | "qr" | "youtube" | "ocr" | "video" | "dev" | null;

export type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

export type ConversionResult = {
  originalName: string;
  newName: string;
  blob: Blob;
  url: string;
  originalSize: number;
  newSize: number;
};
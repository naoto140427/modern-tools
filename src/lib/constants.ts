export const APP_MODES = {
  HOME: null,
  IMAGE: "image",
  PDF: "pdf",
  QR: "qr",
  YOUTUBE: "youtube",
  OCR: "ocr",
  VIDEO: "video", // 👈 これがあるか確認！
  DEV: "dev",
  PRIVACY: "privacy",
} as const;

export type AppMode = (typeof APP_MODES)[keyof typeof APP_MODES];

export const OUTPUT_FORMATS = {
  WEBP: "image/webp",
  JPEG: "image/jpeg",
  PNG: "image/png",
} as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[keyof typeof OUTPUT_FORMATS];
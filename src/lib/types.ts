import { AppMode, OutputFormat } from "./constants";

// 👇 ここが重要！ 手書きの文字列ではなく、constantsから型をもらう形にする
export type Mode = AppMode;

// OutputFormatも再エクスポート
export type { OutputFormat };

// 変換結果の型定義
export type ConversionResult = {
  originalName: string;
  newName: string;
  blob: Blob;
  url: string;
  originalSize: number;
  newSize: number;
};
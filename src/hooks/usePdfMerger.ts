import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface UsePdfMergerReturn {
  isMerging: boolean;
  error: string | null;
  mergePdfs: (files: File[]) => Promise<Blob | null>;
}

export function usePdfMerger(): UsePdfMergerReturn {
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mergePdfs = useCallback(async (files: File[]): Promise<Blob | null> => {
    if (files.length === 0) return null;

    setIsMerging(true);
    setError(null);

    try {
      // 新しいPDFドキュメントを作成
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        // ファイルをArrayBufferとして読み込み
        const arrayBuffer = await file.arrayBuffer();

        // PDFをロード
        const pdf = await PDFDocument.load(arrayBuffer);

        // 全ページをコピー
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        // ページを追加
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // 結合したPDFを保存
      const pdfBytes = await mergedPdf.save();

      // Uint8Arrayを明示的にBlobPartとして扱うための型アサーション
      return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

    } catch (err) {
      console.error("PDF merge failed:", err);
      setError("PDFの結合中にエラーが発生しました。ファイルが破損しているか、暗号化されている可能性があります。");
      return null;
    } finally {
      setIsMerging(false);
    }
  }, []);

  return {
    isMerging,
    error,
    mergePdfs
  };
}

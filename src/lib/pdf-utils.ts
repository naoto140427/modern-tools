import { PDFDocument } from 'pdf-lib';

export async function mergePDFs(files: File[]): Promise<{ blob: Blob; filename: string; count: number }> {
  // 空のPDFドキュメントを作成
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  
  // 👇 ここを修正しました（[pdfBytes] → [pdfBytes as any]）
  // TypeScriptに「型チェックをスキップして」と伝えます
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

  return {
    blob,
    filename: 'merged_document.pdf',
    count: files.length
  };
}
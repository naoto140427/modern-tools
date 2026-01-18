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
  
  // 👇 ESLintを黙らせる
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

  return {
    blob,
    filename: 'merged_document.pdf',
    count: files.length
  };
}
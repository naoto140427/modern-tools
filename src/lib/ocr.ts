import Tesseract from 'tesseract.js';

export async function recognizeText(
  file: File, 
  onProgress: (progress: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Tesseract.recognize(
        file,
        'eng+jpn', // 英語と日本語
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              // 0〜1の数値を送る
              onProgress(m.progress);
            }
          },
        }
      );
      resolve(result.data.text);
    } catch (error) {
      reject(error);
    }
  });
}
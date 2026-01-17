import heic2any from "heic2any";

export type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

// ファイルの拡張子を取得
function getExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg": return ".jpg";
    case "image/png": return ".png";
    case "image/webp": return ".webp";
    default: return ".jpg";
  }
}

export async function convertToWebP(
  file: File, 
  quality: number = 0.8,
  targetFormat: OutputFormat = "image/webp" // 👈 出力形式を選べるように
): Promise<{ blob: Blob; url: string; originalSize: number; newSize: number }> {
  
  return new Promise(async (resolve, reject) => {
    let sourceBlob: Blob = file;

    // 🍏 HEICの場合、まずJPGっぽいBlobに変換してから処理する
    if (file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic") {
      try {
        const result = await heic2any({
          blob: file,
          toType: "image/jpeg", // 一旦JPEGとして扱う
          quality: 1.0
        });
        // heic2anyは単体Blobか配列を返すが、今回は単体として扱う
        sourceBlob = Array.isArray(result) ? result[0] : result;
      } catch (e) {
        console.error("HEIC conversion failed", e);
        reject(new Error("HEIC conversion failed"));
        return;
      }
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not found'));
          return;
        }
        
        // PNG以外（JPG/WebP）の場合、背景を白く塗る（透過対策）
        if (targetFormat !== "image/png") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Conversion failed'));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve({
              blob,
              url,
              originalSize: file.size,
              newSize: blob.size
            });
          },
          targetFormat, // 👈 ここで指定したフォーマットになる
          quality
        );
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(sourceBlob);
  });
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
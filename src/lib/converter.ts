// quality引数 (0.1 〜 1.0) を追加
export async function convertToWebP(file: File, quality: number = 0.8): Promise<{ blob: Blob; url: string; originalSize: number; newSize: number }> {
  return new Promise((resolve, reject) => {
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
        
        ctx.drawImage(img, 0, 0);
        
        // ここで指定された quality を使う！
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
          'image/webp',
          quality // 👈 ここ！
        );
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
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
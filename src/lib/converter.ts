export async function convertToWebP(file: File): Promise<{ blob: Blob; url: string; originalSize: number; newSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // キャンバスを作成（ここに描画して変換する）
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not found'));
          return;
        }
        
        // 画像を描画
        ctx.drawImage(img, 0, 0);
        
        // WebP形式で書き出し (品質 0.8 = 80%)
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
          0.8
        );
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// ファイルサイズを人間が読みやすい形式にする関数 (例: 1024 -> 1KB)
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
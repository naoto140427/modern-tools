import piexif from "piexifjs";

export async function removeExif(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // JPEG以外はそのまま返す（Exif操作はJPEGがメインのため）
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataURL = e.target?.result as string;
        // ここでExifを削除
        const cleanDataURL = piexif.remove(dataURL);
        
        // DataURLをBlobに戻す処理
        const byteString = atob(cleanDataURL.split(',')[1]);
        const mimeString = cleanDataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
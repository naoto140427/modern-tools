
import { env, AutoModel, AutoProcessor, RawImage } from '@xenova/transformers';

// 環境設定
env.allowLocalModels = false;
env.useBrowserCache = true;

// シングルトンパターンでモデルを保持
class BackgroundRemover {
  static model: any = null;
  static processor: any = null;
  static modelId = 'briaai/RMBG-1.4';

  static async getInstance(progressCallback: (data: any) => void) {
    if (!this.model || !this.processor) {
      this.model = await AutoModel.from_pretrained(this.modelId, {
        progress_callback: progressCallback,
      });

      this.processor = await AutoProcessor.from_pretrained(this.modelId, {
        progress_callback: progressCallback,
      });
    }
    return { model: this.model, processor: this.processor };
  }
}

self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  if (type === 'init') {
    try {
      await BackgroundRemover.getInstance((progress) => {
        // transformers.jsのprogressオブジェクト: { status: 'progress' | 'done', name: string, file: string, progress: number, loaded: number, total: number }
        self.postMessage({ type: 'progress', data: progress });
      });
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', data: error });
    }
  } else if (type === 'process') {
    try {
      const { model, processor } = await BackgroundRemover.getInstance(() => {});

      const image = await RawImage.fromURL(data.imageUrl);
      const { pixel_values } = await processor(image);
      const { output } = await model({ input: pixel_values });

      // マスク生成と合成
      // オフスクリーンキャンバスを使用
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error("Failed to get 2d context");

      const maskData = output[0].mul(255).to('uint8').data;
      const originalData = image.data;

      const newImageData = new ImageData(image.width, image.height);

      for (let i = 0; i < maskData.length; i++) {
        const offset = i * 4;
        newImageData.data[offset] = originalData[offset];     // R
        newImageData.data[offset + 1] = originalData[offset + 1]; // G
        newImageData.data[offset + 2] = originalData[offset + 2]; // B
        newImageData.data[offset + 3] = maskData[i];          // A
      }

      ctx.putImageData(newImageData, 0, 0);

      const blob = await canvas.convertToBlob({ type: 'image/png' });

      self.postMessage({ type: 'complete', data: blob });

    } catch (error) {
      console.error(error);
      self.postMessage({ type: 'error', data: error });
    }
  }
});

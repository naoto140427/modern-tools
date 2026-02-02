
import { env, AutoModel, AutoProcessor, RawImage } from '@xenova/transformers';

// 環境設定：ローカルでの実行やWebGPUの使用などを設定
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

      this.processor = await AutoProcessor.from_pretrained(this.modelId);
    }
    return { model: this.model, processor: this.processor };
  }
}

// メッセージリスナー
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  if (type === 'init') {
    try {
      await BackgroundRemover.getInstance((progress) => {
        self.postMessage({ type: 'progress', data: progress });
      });
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', data: error });
    }
  } else if (type === 'process') {
    try {
      const { model, processor } = await BackgroundRemover.getInstance(() => {});

      // 画像の読み込み
      const image = await RawImage.fromURL(data.imageUrl);

      // 前処理
      const { pixel_values } = await processor(image);

      // 推論実行
      const { output } = await model({ input: pixel_values });

      // マスク処理（結果からマスク画像を生成）
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

      // 元画像にアルファチャンネルとしてマスクを適用するのはメインスレッド（Canvas）で行う方が柔軟性が高いため、
      // ここではマスク画像をBlob/DataURLとして返す、あるいは生データを返す。
      // Transformers.jsの機能を使ってマスク画像を生成し、それを返すのが手軽。

      // 注意: RawImageから直接Blobを作るメソッドがない場合があるため、一度Canvasを経由するか、
      // 処理済みのRGBAデータを返す必要がある。
      // ここではシンプルに、メインスレッド側で合成するためにマスクのDataURLを返すアプローチをとる。
      // もしくは、transformers.jsの新しいAPIで直接背景削除ができる場合はそれを使うが、
      // RMBG-1.4はマスクを返すモデルであるため、合成が必要。

      // Web Worker内ではCanvas APIの一部が制限されるが、OffscreenCanvasが使える場合はそれを使う。
      // ただし互換性を考慮し、ここでは処理済みマスクのRawImageデータをメインスレッドに送る。
      // もっと簡単な方法として、RMBGの出力をそのまま返す。

      // 修正: 確実に動作させるため、推論結果のマスクをCanvasに描画し、そこからBlobを作成して返す。
      // OffscreenCanvasを使用。
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error("Failed to get 2d context");

      // 元画像を描画
      // RawImageをImageDataに変換して描画する必要があるが、transformers.jsのRawImageは少し扱いが特殊。
      // ここでは、マスクのみを返すのではなく、Worker内で合成までやってしまうのがベスト。

      // 1. マスクデータの取得
      // outputは[1, 1, H, W]のTensor。

      // よりシンプルな方法：
      // RawImageには `save` メソッドなどがないため、ピクセルデータを操作する。

      const maskData = output[0].mul(255).to('uint8').data;
      const originalData = image.data; // Uint8ClampedArray (RGBA)

      const newImageData = new ImageData(image.width, image.height);

      for (let i = 0; i < maskData.length; i++) {
        const offset = i * 4;
        newImageData.data[offset] = originalData[offset];     // R
        newImageData.data[offset + 1] = originalData[offset + 1]; // G
        newImageData.data[offset + 2] = originalData[offset + 2]; // B
        newImageData.data[offset + 3] = maskData[i];          // A (マスク値をアルファとして使用)
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

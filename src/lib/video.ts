import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export class VideoProcessor {
  // 初期値は null にしておき、サーバー側での起動を防ぐ
  private ffmpeg: FFmpeg | null = null;
  private loaded: boolean = false;

  constructor() {
    // ⚠️ ここでは new FFmpeg() をしない！
    // これでサーバー側でのクラッシュを防ぎます
  }

  // エンジンのロード（初回のみ重い）
  async load(onProgress: (p: number) => void) {
    if (this.loaded && this.ffmpeg) return;

    // 👇 ここで初めてインスタンス化する（ここはブラウザでしか実行されないため安全）
    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    // 進行状況のイベントリスナー
    this.ffmpeg.on('progress', ({ progress }) => {
      onProgress(progress);
    });

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.loaded = true;
  }

  // 動画圧縮処理
  async compress(file: File, onProgress: (p: number) => void): Promise<Blob> {
    // ロードされていなければロードする
    if (!this.loaded || !this.ffmpeg) {
      await this.load((p) => {});
    }
    
    // TypeScriptの型ガード（念のため）
    if (!this.ffmpeg) throw new Error("FFmpeg not loaded");

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    await this.ffmpeg.writeFile(inputName, await fetchFile(file));

    // 圧縮コマンド実行 (CRF 28)
    await this.ffmpeg.exec([
      '-i', inputName,
      '-vcodec', 'libx264',
      '-crf', '28',
      '-preset', 'ultrafast',
      outputName
    ]);

    const data = await this.ffmpeg.readFile(outputName);
    
    await this.ffmpeg.deleteFile(inputName);
    await this.ffmpeg.deleteFile(outputName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Blob([(data as any)], { type: 'video/mp4' });
  }
}

export const videoProcessor = new VideoProcessor();
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export class AudioProcessor {
  private ffmpeg: FFmpeg | null = null;
  private loaded: boolean = false;

  async load(onProgress: (p: number) => void) {
    if (this.loaded && this.ffmpeg) return;

    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
    }

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    this.ffmpeg.on('progress', ({ progress }) => {
      onProgress(progress);
    });

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.loaded = true;
  }

  async convertToMp3(file: File, onProgress: (p: number) => void): Promise<Blob> {
    if (!this.loaded || !this.ffmpeg) {
      await this.load((p) => {});
    }

    if (!this.ffmpeg) throw new Error("FFmpegが読み込まれていません");

    const inputName = `input_${file.name.replace(/\s/g, '_')}`;
    const outputName = 'output.mp3';

    await this.ffmpeg.writeFile(inputName, await fetchFile(file));

    // MP3変換 (192k)
    await this.ffmpeg.exec([
      '-i', inputName,
      '-b:a', '192k',
      outputName
    ]);

    const data = await this.ffmpeg.readFile(outputName);

    await this.ffmpeg.deleteFile(inputName);
    await this.ffmpeg.deleteFile(outputName);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Blob([(data as any)], { type: 'audio/mpeg' });
  }
}

export const audioProcessor = new AudioProcessor();

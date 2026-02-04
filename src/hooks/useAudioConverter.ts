import { useState, useRef, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { z } from 'zod';

// Video Converterと同じインスタンスを共有または新規作成
// シングルトンパターンでリソースを節約
let ffmpegInstance: FFmpeg | null = null;

const AudioFormatSchema = z.enum(["mp3", "wav", "aac", "ogg"]);
export type AudioFormat = z.infer<typeof AudioFormatSchema>;

interface FFmpegProgressEvent {
  progress: number;
  time: number;
}

interface ConvertOptions {
  file: File;
  outputFormat: AudioFormat;
}

interface UseAudioConverterReturn {
  isLoaded: boolean;
  isLoading: boolean;
  isConverting: boolean;
  progress: number;
  error: string | null;
  loadFFmpeg: () => Promise<void>;
  convertAudio: (options: ConvertOptions) => Promise<Blob | null>;
}

export function useAudioConverter(): UseAudioConverterReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegInstance && ffmpegInstance.loaded) {
      setIsLoaded(true);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const ffmpeg = new FFmpeg();
      ffmpegInstance = ffmpeg;

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      if (isMounted.current) {
        setIsLoaded(true);
      }
    } catch (err) {
      console.error("FFmpeg load failed:", err);
      if (isMounted.current) {
        setError("FFmpegのロードに失敗しました。");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  const convertAudio = useCallback(async ({ file, outputFormat }: ConvertOptions): Promise<Blob | null> => {
    if (!ffmpegInstance || !ffmpegInstance.loaded) {
      setError("FFmpegがロードされていません。");
      return null;
    }

    setIsConverting(true);
    setProgress(0);
    setError(null);

    const handleProgress = ({ progress }: FFmpegProgressEvent) => {
      if (isMounted.current) {
        setProgress(Math.round(progress * 100));
      }
    };

    try {
      const ffmpeg = ffmpegInstance;
      ffmpeg.on('progress', handleProgress);

      // 拡張子を取得
      const ext = file.name.split('.').pop() || 'tmp';
      const inputFileName = `input.${ext}`;
      const outputFileName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      // コマンド構築
      // オーディオ変換用の基本的なパラメータ
      const args = ['-i', inputFileName];

      if (outputFormat === 'mp3') {
        args.push('-acodec', 'libmp3lame', '-q:a', '2');
      } else if (outputFormat === 'aac') {
        args.push('-acodec', 'aac', '-b:a', '192k');
      }

      args.push(outputFileName);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputFileName);

      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      let mimeType = 'audio/mpeg';
      if (outputFormat === 'wav') mimeType = 'audio/wav';
      if (outputFormat === 'ogg') mimeType = 'audio/ogg';
      if (outputFormat === 'aac') mimeType = 'audio/aac';

      return new Blob([data as unknown as BlobPart], { type: mimeType });

    } catch (err) {
      console.error("Audio conversion failed:", err);
      if (isMounted.current) {
        setError("音声の変換中にエラーが発生しました。");
      }
      return null;
    } finally {
      if (ffmpegInstance) {
        ffmpegInstance.off('progress', handleProgress);
      }
      if (isMounted.current) {
        setIsConverting(false);
      }
    }
  }, []);

  return {
    isLoaded,
    isLoading,
    isConverting,
    progress,
    error,
    loadFFmpeg,
    convertAudio
  };
}

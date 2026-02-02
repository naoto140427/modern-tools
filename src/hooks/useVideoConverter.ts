import { useState, useRef, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { z } from 'zod';

// 型定義のインポート問題を回避するため、必要な型をここで定義またはFFmpegから直接取得を試みる
// @ffmpeg/ffmpegのバージョンによってパスが異なる場合があるため、ProgressEventは手動定義で安全策をとる
interface FFmpegProgressEvent {
  progress: number;
  time: number;
}

// FFmpegのインスタンスはコンポーネント外で保持（シングルトン）
let ffmpegInstance: FFmpeg | null = null;

// Zodスキーマ
const VideoFormatSchema = z.enum(["mp4", "webm"]);
export type VideoFormat = z.infer<typeof VideoFormatSchema>;

// バリデーションチェック用関数
export function validateVideoFormat(format: string): boolean {
  return VideoFormatSchema.safeParse(format).success;
}

interface ConvertOptions {
  file: File;
  outputFormat: VideoFormat;
}

interface UseVideoConverterReturn {
  isLoaded: boolean;
  isLoading: boolean;
  isConverting: boolean;
  progress: number;
  error: string | null;
  loadFFmpeg: () => Promise<void>;
  convertVideo: (options: ConvertOptions) => Promise<Blob | null>;
}

export function useVideoConverter(): UseVideoConverterReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // コンポーネントがアンマウントされたかどうかを追跡
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

      // coreURL, wasmURLのロード
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
        setError("FFmpegのロードに失敗しました。ブラウザの設定やネットワーク接続を確認してください。");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  const convertVideo = useCallback(async ({ file, outputFormat }: ConvertOptions): Promise<Blob | null> => {
    if (!ffmpegInstance || !ffmpegInstance.loaded) {
      setError("FFmpegがロードされていません。");
      return null;
    }

    setIsConverting(true);
    setProgress(0);
    setError(null);

    // プログレスハンドラーの定義
    const handleProgress = ({ progress }: FFmpegProgressEvent) => {
      if (isMounted.current) {
        setProgress(Math.round(progress * 100));
      }
    };

    // エラーハンドラー（ログからエラーを検知する場合などに使用可だが、今回はシンプルに）
    // const handleLog = ({ message }: LogEvent) => { console.log(message); };

    try {
      const ffmpeg = ffmpegInstance;

      // リスナー登録
      ffmpeg.on('progress', handleProgress);
      // ffmpeg.on('log', handleLog);

      const inputFileName = 'input_video';
      const outputFileName = `output.${outputFormat}`;

      await ffmpeg.writeFile(inputFileName, await fetchFile(file));

      await ffmpeg.exec(['-i', inputFileName, outputFileName]);

      const data = await ffmpeg.readFile(outputFileName);

      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      const mimeType = outputFormat === 'mp4' ? 'video/mp4' : 'video/webm';
      return new Blob([data as unknown as BlobPart], { type: mimeType });

    } catch (err) {
      console.error("Video conversion failed:", err);
      if (isMounted.current) {
        setError("動画の変換中にエラーが発生しました。");
      }
      return null;
    } finally {
      // リスナー解除（メモリリーク防止）
      if (ffmpegInstance) {
        ffmpegInstance.off('progress', handleProgress);
        // ffmpegInstance.off('log', handleLog);
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
    convertVideo
  };
}

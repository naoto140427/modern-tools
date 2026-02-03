import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAiBackgroundRemoverReturn {
  isReady: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  progress: number; // 0-100
  loadingStatus: string | null;
  error: string | null;
  result: Blob | null;
  loadModel: () => void;
  processImage: (image: File) => void;
  reset: () => void;
}

export function useAiBackgroundRemover(): UseAiBackgroundRemoverReturn {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Web Workerの初期化
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), {
        type: 'module'
      });

      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;

        switch (type) {
          case 'progress':
            if (data.status === 'progress') {
                const percent = data.progress ? Math.round(data.progress) : 0;
                // ファイル名を短縮して表示
                const fileName = data.file ? data.file.split('/').pop() : 'model';
                setLoadingStatus(fileName);
                setProgress(percent);
            } else if (data.status === 'done') {
                // ダウンロード完了、次のステップへ
                setProgress(100);
            } else if (data.status === 'initiate') {
                setLoadingStatus(data.file);
                setProgress(0);
            }
            break;
          case 'ready':
            setIsReady(true);
            setIsLoading(false);
            setLoadingStatus(null);
            setProgress(100);
            break;
          case 'complete':
            setResult(data);
            setIsProcessing(false);
            break;
          case 'error':
            setError("AI処理中にエラーが発生しました。");
            console.error(data);
            setIsLoading(false);
            setIsProcessing(false);
            break;
        }
      };
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const loadModel = useCallback(() => {
    if (isReady || isLoading) return;
    setIsLoading(true);
    setLoadingStatus(null);
    workerRef.current?.postMessage({ type: 'init' });
  }, [isReady, isLoading]);

  const processImage = useCallback((image: File) => {
    if (!isReady) return;
    setIsProcessing(true);
    setError(null);
    setResult(null);

    const imageUrl = URL.createObjectURL(image);
    workerRef.current?.postMessage({ type: 'process', data: { imageUrl } });
  }, [isReady]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    isReady,
    isLoading,
    isProcessing,
    progress,
    loadingStatus,
    error,
    result,
    loadModel,
    processImage,
    reset
  };
}

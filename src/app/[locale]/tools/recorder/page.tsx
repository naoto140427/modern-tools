"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  ChevronLeft,
  Mic,
  MicOff,
  Monitor,
  Circle,
  Square,
  Download,
  Save,
  RefreshCw,
  Play
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useFileShelf } from "@/context/FileShelfContext";
import { toast } from "sonner";

export default function RecorderPage() {
  const t = useTranslations("Recorder");
  const { addItem } = useFileShelf();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startRecording = async () => {
    try {
      // Request screen stream
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true // System audio
      });

      // Request mic stream if enabled
      let combinedStream = displayStream;
      if (micEnabled) {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Combine tracks
            combinedStream = new MediaStream([
                ...displayStream.getVideoTracks(),
                ...displayStream.getAudioTracks(),
                ...audioStream.getAudioTracks()
            ]);
        } catch (e) {
            console.warn("Mic access denied or unavailable", e);
            toast.warning("Microphone access denied, recording video only.");
        }
      }

      setStream(combinedStream);

      if (videoRef.current) {
        videoRef.current.srcObject = combinedStream;
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = URL.createObjectURL(blob);
            videoRef.current.controls = true;
            videoRef.current.muted = false; // Unmute for playback
        }
        // Stop all tracks
        combinedStream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsRecording(false);
      };

      // Stop recording if user stops sharing via browser UI
      displayStream.getVideoTracks()[0].onended = () => {
          stopRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedBlob(null);

    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error("Failed to start recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const downloadVideo = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screen-recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveToShelf = () => {
    if (!recordedBlob) return;
    const file = new (File as any)([recordedBlob], `screen-recording-${Date.now()}.webm`, { type: "video/webm" });
    addItem(file, "Screen Recorder");
  };

  const reset = () => {
      setRecordedBlob(null);
      if (videoRef.current) {
          videoRef.current.src = "";
          videoRef.current.srcObject = null;
      }
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-6xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <div className="relative">
                <Video className="w-8 h-8 text-rose-500" />
                {isRecording && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                )}
            </div>
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Viewport */}
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative border border-white/10 group">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isRecording} // Mute preview while recording to avoid feedback
                    className="w-full h-full object-contain"
                />

                {!isRecording && !recordedBlob && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 pointer-events-none">
                        <Monitor className="w-16 h-16 opacity-20 mb-4" />
                        <p className="text-sm font-medium opacity-50">Ready to Capture</p>
                    </div>
                )}

                {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono font-medium text-red-200">REC</span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setMicEnabled(!micEnabled)}
                        disabled={isRecording}
                        className={`h-12 w-12 rounded-full border-white/10 transition-all ${micEnabled ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    <span className="text-sm text-neutral-400 hidden md:inline-block">
                        {micEnabled ? "Microphone On" : "Microphone Off"}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    {!isRecording && !recordedBlob && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startRecording}
                            className="h-16 w-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/40 ring-4 ring-rose-900/20 group transition-all"
                        >
                            <div className="w-6 h-6 bg-white rounded-full group-hover:scale-110 transition-transform" />
                        </motion.button>
                    )}

                    {isRecording && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={stopRecording}
                            className="h-16 w-16 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center border border-white/10"
                        >
                            <Square className="w-6 h-6 fill-white text-white" />
                        </motion.button>
                    )}

                    {recordedBlob && (
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Button onClick={downloadVideo} className="h-12 bg-white text-black hover:bg-neutral-200 rounded-xl px-6">
                                <Download className="w-4 h-4 mr-2" />
                                {t('actions.download')}
                            </Button>
                            <Button variant="outline" onClick={saveToShelf} className="h-12 border-white/10 hover:bg-white/10 rounded-xl px-6">
                                <Save className="w-4 h-4 mr-2" />
                                {t('actions.saveToShelf')}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={reset} className="h-12 w-12 rounded-xl text-neutral-400 hover:text-white">
                                <RefreshCw className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="w-12 hidden md:block" /> {/* Spacer for centering */}
            </div>
        </div>
      </motion.div>
    </div>
  );
}

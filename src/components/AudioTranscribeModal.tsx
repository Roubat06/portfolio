import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Copy, Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTranscriptInRag?: (transcript: string) => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onUseTranscriptInRag,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!isOpen) {
      stopRecordingCleanup();
      setError(null);
    }
  }, [isOpen]);

  const stopRecordingCleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const startRecording = async () => {
    setError(null);
    setTranscript('');
    setAudioBlob(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(finalBlob);
        stream.getTracks().forEach((track) => track.stop());
        autoTranscribeBlob(finalBlob, mimeType);
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Mic access error:', err);
      setError(err instanceof Error ? err.message : 'Could not access microphone.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const autoTranscribeBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const dataUrl = await base64Promise;

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: dataUrl,
          mimeType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe audio with gemini-3.5-transcribe.');
      }

      setTranscript(data.transcript || 'No audible speech detected.');
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Transcription failed.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-white text-[#050505] rounded-3xl border border-neutral-300 shadow-2xl p-6 md:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient color bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Model: gemini-3.5-transcribe · Live Microphone Input</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-neutral-900">
              Audio Transcription
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Record speech using your microphone to transcribe in real time with Gemini 3.5 Transcribe.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Visualizer Card */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100/70 border border-neutral-200 text-center flex flex-col items-center justify-center min-h-[190px]">
          {isRecording ? (
            <div className="space-y-4">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" />
                <span className="absolute w-18 h-18 rounded-full bg-rose-500/30 animate-pulse" />
                <button
                  type="button"
                  onClick={stopRecording}
                  aria-label="Stop recording"
                  className="relative z-10 w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-transform active:scale-95 shadow-lg shadow-rose-500/30 cursor-pointer"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Animated waveform bars */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 75, 100, 60, 90, 45, 80, 50, 95, 70, 85].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [`${height * 0.3}%`, `${height}%`, `${height * 0.4}%`],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 4) * 0.2,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-gradient-to-t from-rose-600 to-amber-500 rounded-full"
                  />
                ))}
              </div>

              <div className="text-sm font-mono font-semibold text-rose-600">
                Recording... {Math.floor(recordingDuration / 60)}:
                {String(recordingDuration % 60).padStart(2, '0')}
              </div>
            </div>
          ) : isTranscribing ? (
            <div className="space-y-3 py-4">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
              </div>
              <div className="text-sm font-semibold text-neutral-800">
                Transcribing with gemini-3.5-transcribe...
              </div>
              <p className="text-xs text-neutral-500">
                Processing audio stream with Google GenAI SDK
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={startRecording}
                className="group relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Mic className="w-7 h-7" />
              </button>
              <div className="text-sm font-bold text-neutral-800">
                Click microphone to start recording
              </div>
              <p className="text-xs text-neutral-500 max-w-sm">
                Speak questions about Roubat's projects (e.g., "Tell me about Striveda", "What did Roubat build?")
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Transcript Output Box */}
        {transcript && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
              <span>Transcribed Speech Result:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 leading-relaxed max-h-40 overflow-y-auto">
              "{transcript}"
            </div>

            {onUseTranscriptInRag && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onUseTranscriptInRag(transcript);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Send Voice Query into Portfolio RAG Assistant</span>
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

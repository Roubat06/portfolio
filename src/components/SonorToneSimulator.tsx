import React, { useState } from 'react';
import { Volume2, Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TONES = [
  { id: 'warm', label: 'Warm', color: 'from-amber-500 to-orange-500', border: 'border-amber-400 text-amber-700 bg-amber-50' },
  { id: 'assertive', label: 'Assertive', color: 'from-blue-600 to-indigo-600', border: 'border-blue-400 text-blue-700 bg-blue-50' },
  { id: 'diplomatic', label: 'Diplomatic', color: 'from-emerald-600 to-teal-600', border: 'border-emerald-400 text-emerald-700 bg-emerald-50' },
  { id: 'empathetic', label: 'Empathetic', color: 'from-purple-600 to-pink-600', border: 'border-purple-400 text-purple-700 bg-purple-50' },
  { id: 'professional', label: 'Professional', color: 'from-sky-600 to-blue-700', border: 'border-sky-400 text-sky-700 bg-sky-50' },
  { id: 'casual', label: 'Casual', color: 'from-teal-500 to-cyan-500', border: 'border-teal-400 text-teal-700 bg-teal-50' },
];

const REWRITES: Record<string, { rewritten: string; risk: { phrase: string; severity: 'HIGH' | 'LOW'; fix: string } | null }> = {
  warm: {
    rewritten: "Hey team! Whenever you have a quick moment today, could we wrap up this report? Really appreciate all your hard work on this! 😊",
    risk: null,
  },
  assertive: {
    rewritten: "Please complete and submit the finalized report by 5:00 PM today as it is past the agreed project deadline.",
    risk: { phrase: "past the agreed project deadline", severity: 'LOW', fix: 'Add actionable context or offer assistance if obstacles remain' },
  },
  diplomatic: {
    rewritten: "To ensure we keep the project timeline on schedule for all stakeholders, it would be very helpful to finalize the remaining sections of this report today.",
    risk: null,
  },
  empathetic: {
    rewritten: "I know how packed everyone's workload has been this week, but could we try to get this report wrapped up today so you don't have it hanging over you?",
    risk: null,
  },
  professional: {
    rewritten: "Please provide the completed report today to maintain alignment with our deliverables schedule.",
    risk: null,
  },
  casual: {
    rewritten: "Hey guys, any chance we can knock out this report today? Thanks a ton!",
    risk: null,
  },
};

export const SonorToneSimulator: React.FC = () => {
  const [activeTone, setActiveTone] = useState<string>('warm');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSelectTone = (toneId: string) => {
    if (toneId === activeTone) return;
    setIsStreaming(true);
    setActiveTone(toneId);
    setTimeout(() => {
      setIsStreaming(false);
    }, 350);
  };

  const activeData = REWRITES[activeTone];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 text-white border border-cyan-500/30 shadow-lg space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-mono-tabular border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            Sonor SSE Tone Calibration Engine
          </span>
        </div>
        <span className="text-neutral-400 text-[11px]">
          FastAPI + Gemini Multi-Model Router
        </span>
      </div>

      {/* Input context */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
          Input Draft (Original):
        </div>
        <div className="text-xs text-neutral-300 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 italic">
          &ldquo;You need to finish this report today, it&apos;s already late.&rdquo;
        </div>
      </div>

      {/* Tone selection pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
          <span>Target Tone (6 Pydantic Options):</span>
          <span className="text-cyan-400 text-[10px]">Real-Time Streaming</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((tone) => {
            const isSelected = activeTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => handleSelectTone(tone.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r ' + tone.color + ' text-white shadow-sm scale-102 ring-1 ring-white/50'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {tone.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Streaming Output Box */}
      <div className="p-3.5 rounded-xl bg-neutral-900 border border-cyan-900/40 space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Streaming Output ({TONES.find((t) => t.id === activeTone)?.label}):</span>
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-[10px] text-cyan-300 animate-pulse">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>text/event-stream</span>
            </span>
          )}
        </div>

        <div className="text-xs text-white leading-relaxed font-sans min-h-[44px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTone}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {activeData.rewritten}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Risk Check Badge */}
        {activeData.risk ? (
          <div className="pt-2 border-t border-neutral-800/80 flex items-start gap-1.5 text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-800/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Risk Flag ({activeData.risk.severity}):</span> &ldquo;{activeData.risk.phrase}&rdquo; — {activeData.risk.fix}
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero communication risks flagged by Pydantic validator.</span>
          </div>
        )}
      </div>
    </div>
  );
};

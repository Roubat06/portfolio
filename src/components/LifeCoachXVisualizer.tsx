import React, { useState } from 'react';
import { Activity, Music, Heart, Sparkles, Volume2, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';

const SOUNDSCAPES = [
  { id: 'focus', title: 'Focus Alpha Flow', freq: '10.5 Hz Alpha Waves', tempo: '60 BPM', mood: 'Mental Clarity' },
  { id: 'calm', title: 'Vagus Reset Calm', freq: '432 Hz Solfeggio Harmonics', tempo: '52 BPM', mood: 'Stress Reduction' },
  { id: 'sleep', title: 'Deep Delta Soundscape', freq: '2.5 Hz Delta Pulse', tempo: '45 BPM', mood: 'Sleep Restoration' },
];

export const LifeCoachXVisualizer: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState(SOUNDSCAPES[0]);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 text-white border border-emerald-500/30 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono-tabular border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-300 font-bold uppercase tracking-wider">
            LifeCoachX NumPy WAV Synthesis & Biometrics
          </span>
        </div>
        <span className="text-neutral-400 text-[11px]">
          44.1kHz Multi-Wave Generator
        </span>
      </div>

      {/* Live Frequency Wave Visualizer Bar */}
      <div className="p-4 rounded-xl bg-neutral-900/90 border border-emerald-900/40 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <div>
              <div className="font-bold text-white text-xs">{activeTrack.title}</div>
              <div className="text-[10px] font-mono text-emerald-400">{activeTrack.freq} · {activeTrack.tempo}</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{isPlaying ? 'Synthesizing 44.1kHz' : 'Paused'}</span>
          </span>
        </div>

        {/* Dynamic Graphic Equalizer Bars */}
        <div className="h-10 flex items-end justify-between gap-1 px-1 bg-black/40 rounded-lg p-2 overflow-hidden">
          {[...Array(24)].map((_, i) => {
            const animClass = !isPlaying
              ? 'h-1 bg-neutral-700'
              : i % 3 === 0
              ? 'animate-bar-1 bg-emerald-400'
              : i % 3 === 1
              ? 'animate-bar-2 bg-teal-400'
              : 'animate-bar-3 bg-cyan-400';

            return (
              <div
                key={i}
                className={`w-full rounded-t-sm transition-all duration-200 ${animClass}`}
                style={{
                  minHeight: '4px',
                  animationDelay: `${(i * 0.08) % 1}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Preset Soundscape Switcher */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between">
          <span>Select Waveform Preset (Python/NumPy DSP Engine):</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SOUNDSCAPES.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                setActiveTrack(track);
                setIsPlaying(true);
              }}
              className={`p-2 rounded-xl text-left transition-all cursor-pointer ${
                activeTrack.id === track.id
                  ? 'bg-emerald-950 border border-emerald-500 text-white shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-400'
              }`}
            >
              <div className="text-xs font-semibold truncate">{track.title}</div>
              <div className="text-[10px] font-mono text-emerald-400 truncate">{track.mood}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 7-Day Diet & Workout AI Status Footer */}
      <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800/80">
          <div className="text-emerald-400 font-bold font-mono">Gemini 2.0 Flash Diet API</div>
          <div className="text-neutral-400 text-[10px] mt-0.5">Calculates BMI & macro targets across 7-day meal plans</div>
        </div>
        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800/80">
          <div className="text-teal-400 font-bold font-mono">Socket.IO + MySQL Chat</div>
          <div className="text-neutral-400 text-[10px] mt-0.5">Real-time peer chat & 1-on-1 private messaging</div>
        </div>
      </div>
    </div>
  );
};

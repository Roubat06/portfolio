import React, { useState } from 'react';
import { DollarSign, Smile, Clock, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const SCENARIOS = [
  {
    block: 'Morning Block (8:00 AM)',
    situation: 'You have 30 minutes before work starts. How do you spend this time and your morning budget?',
    options: [
      {
        title: 'Option A: Grab $7 artisanal espresso + pastry, review tasks',
        moneyDelta: -7,
        moodDelta: +15,
        points: +20,
        reflection: 'Quick mood boost, but reduces your daily budget cushion.',
      },
      {
        title: 'Option B: Brew coffee at home, 15-min focused planning',
        moneyDelta: -1,
        moodDelta: +10,
        points: +35,
        reflection: 'High productivity and financial discipline, preserving budget for evening goals.',
      },
    ],
  },
  {
    block: 'Afternoon Block (2:00 PM)',
    situation: 'A coworker invites you to a catered team masterclass ($25 ticket) during lunch break.',
    options: [
      {
        title: 'Option A: Join the paid workshop ($25) for networking & skill building',
        moneyDelta: -25,
        moodDelta: +25,
        points: +50,
        reflection: 'Investment in social capital and high long-term career returns.',
      },
      {
        title: 'Option B: Stick to free lunch walk and reading saved articles',
        moneyDelta: 0,
        moodDelta: +10,
        points: +25,
        reflection: 'Saves funds while still resetting cognitive focus for afternoon work.',
      },
    ],
  },
];

export const StrivedaGameSimulator: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [money, setMoney] = useState(120);
  const [mood, setMood] = useState(70);
  const [score, setScore] = useState(140);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const scenario = SCENARIOS[activeStep % SCENARIOS.length];

  const handleSelectOption = (opt: typeof scenario.options[0]) => {
    setMoney((prev) => Math.max(0, prev + opt.moneyDelta));
    setMood((prev) => Math.min(100, Math.max(0, prev + opt.moodDelta)));
    setScore((prev) => prev + opt.points);
    setLastFeedback(opt.reflection);
    setActiveStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setMoney(120);
    setMood(70);
    setScore(140);
    setActiveStep(0);
    setLastFeedback(null);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 text-white border border-indigo-500/30 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono-tabular border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-indigo-300 font-bold uppercase tracking-wider">
            Striveda 25-Scenario Decision Engine
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-[10px]"
        >
          Reset Simulation
        </button>
      </div>

      {/* Live State Meters */}
      <div className="grid grid-cols-3 gap-2.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Budget</span>
            </span>
            <span className="text-emerald-400 font-bold font-mono-tabular">${money}</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${Math.min(100, (money / 150) * 100)}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <Smile className="w-3 h-3 text-amber-400" />
              <span>Mood</span>
            </span>
            <span className="text-amber-400 font-bold font-mono-tabular">{mood}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${mood}%` }}
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-indigo-400" />
              <span>Points</span>
            </span>
            <span className="text-indigo-400 font-bold font-mono-tabular">{score}</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${Math.min(100, (score / 300) * 100)}%` }}
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Current Scenario Card */}
      <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-indigo-900/40 space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-300">
          <Clock className="w-3 h-3 text-indigo-400" />
          <span>{scenario.block} · Round {activeStep + 1}</span>
        </div>
        <p className="text-xs text-neutral-200 leading-relaxed font-sans">
          {scenario.situation}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {scenario.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectOption(opt)}
              className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-indigo-950/50 border border-neutral-800 hover:border-indigo-500/60 text-left transition-all cursor-pointer group space-y-1"
            >
              <div className="text-xs font-semibold text-neutral-100 group-hover:text-indigo-300 flex items-center justify-between">
                <span>{opt.title}</span>
                <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-indigo-400 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-2">
                <span className={opt.moneyDelta < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {opt.moneyDelta < 0 ? `-$${Math.abs(opt.moneyDelta)}` : `$${opt.moneyDelta}`}
                </span>
                <span>·</span>
                <span className="text-amber-400">+{opt.moodDelta} Mood</span>
                <span>·</span>
                <span className="text-indigo-400">+{opt.points} Pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback banner */}
      {lastFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span><strong>Analysis:</strong> {lastFeedback}</span>
        </motion.div>
      )}
    </div>
  );
};

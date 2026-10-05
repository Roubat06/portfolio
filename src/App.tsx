/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  SlidersHorizontal,
  Mic,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Activity,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INITIAL_PROJECTS,
  PORTFOLIO_OWNER,
  PortfolioProject,
} from './data/projects';
import { CaseStudyModal } from './components/CaseStudyModal';
import { RagAssistantSection } from './components/RagAssistantSection';
import { DataOrderDrawer } from './components/DataOrderDrawer';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { SonorToneSimulator } from './components/SonorToneSimulator';
import { StrivedaGameSimulator } from './components/StrivedaGameSimulator';
import { LifeCoachXVisualizer } from './components/LifeCoachXVisualizer';

import heroEditorialImg from './assets/images/hero_engineering_editorial_1790573133291.jpg';
import sonorImg from './assets/images/sonor_case_study_1791202656801.jpg';
import strivedaImg from './assets/images/striveda_case_study_1790573147021.jpg';
import commerceImg from './assets/images/commerce_platform_case_study_1790573166081.jpg';
import lifecoachxImg from './assets/images/lifecoachx_case_study_1790573179901.jpg';

const PROJECT_IMAGE_MAP: Record<string, string> = {
  sonor: sonorImg,
  striveda: strivedaImg,
  commerce: commerceImg,
  lifecoachx: lifecoachxImg,
};

const PROJECT_COLOR_THEMES: Record<
  string,
  {
    gradient: string;
    borderHover: string;
    glowBg: string;
    badgeText: string;
    accentHex: string;
    icon: React.ReactNode;
  }
> = {
  striveda: {
    gradient: 'from-indigo-600 via-purple-600 to-blue-600',
    borderHover: 'hover:border-indigo-500 hover:shadow-indigo-500/15',
    glowBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-700',
    accentHex: '#6366F1',
    icon: <Cpu className="w-4 h-4 text-indigo-600" />,
  },
  'v0-commerce-student-platform': {
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    borderHover: 'hover:border-amber-500 hover:shadow-amber-500/15',
    glowBg: 'bg-amber-500/10',
    badgeText: 'text-amber-700',
    accentHex: '#D97706',
    icon: <ShoppingBag className="w-4 h-4 text-amber-600" />,
  },
  lifecoachx: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    borderHover: 'hover:border-emerald-500 hover:shadow-emerald-500/15',
    glowBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-700',
    accentHex: '#059669',
    icon: <Activity className="w-4 h-4 text-emerald-600" />,
  },
  sonor: {
    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
    borderHover: 'hover:border-cyan-500 hover:shadow-cyan-500/15',
    glowBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-700',
    accentHex: '#0284C7',
    icon: <Layers className="w-4 h-4 text-cyan-600" />,
  },
  tamperlock: {
    gradient: 'from-rose-500 via-red-500 to-pink-500',
    borderHover: 'hover:border-rose-500 hover:shadow-rose-500/15',
    glowBg: 'bg-rose-500/10',
    badgeText: 'text-rose-700',
    accentHex: '#E11D48',
    icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
  },
};

interface ResilientImageProps {
  src?: string;
  alt: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  className?: string;
}

const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col justify-between p-8 bg-[#050505] text-[#F4F4F0] ${className}`}
      >
        <div className="text-xs font-mono-tabular text-neutral-400">
          {fallbackSubtitle}
        </div>
        <div className="text-2xl font-bold tracking-tight font-display">
          {fallbackTitle}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};

export default function App() {
  const [projects, setProjects] = useState<PortfolioProject[]>(INITIAL_PROJECTS);
  const [activeCaseStudy, setActiveCaseStudy] = useState<PortfolioProject | null>(
    null
  );
  const [showAllDirectory, setShowAllDirectory] = useState<boolean>(false);
  const [directoryFilter, setDirectoryFilter] = useState<
    'all' | 'featured' | 'ai' | 'cv'
  >('all');
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [ragTriggerQuery, setRagTriggerQuery] = useState<string | null>(null);

  // Feature modals for Audio Transcription (gemini-3.5-transcribe) and Image Studio (gemini-3.1-flash-image-preview)
  const [isAudioTranscribeOpen, setIsAudioTranscribeOpen] = useState(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);

  // Filter strictly for completed (or explicitly enabled) projects, sorted by data-driven priority
  const completedProjects = useMemo(() => {
    return [...projects]
      .filter((p) => p.status === 'completed')
      .sort((a, b) => a.priority - b.priority);
  }, [projects]);

  // Main showcase projects: Sonor (First Priority), Striveda (Priority 2), LifeCoachX (Priority 3)
  const mainProjects = useMemo(() => {
    return [...completedProjects]
      .filter((p) => ['sonor', 'striveda', 'lifecoachx'].includes(p.id))
      .sort((a, b) => a.priority - b.priority);
  }, [completedProjects]);

  // Secondary projects: TamperLock, v0-commerce-student-platform (NOT showcased as main)
  const secondaryProjects = useMemo(() => {
    return [...completedProjects]
      .filter((p) => !['sonor', 'striveda', 'lifecoachx'].includes(p.id))
      .sort((a, b) => a.priority - b.priority);
  }, [completedProjects]);

  // Filtered directory list when "View all projects →" is expanded
  const filteredDirectoryProjects = useMemo(() => {
    return completedProjects.filter((p) => {
      if (directoryFilter === 'featured') return p.featured;
      if (directoryFilter === 'ai')
        return ['striveda', 'lifecoachx', 'sonor'].includes(p.id);
      if (directoryFilter === 'cv') return p.id === 'tamperlock';
      return true;
    });
  }, [completedProjects, directoryFilter]);

  const handleMovePriority = (projectId: string, direction: 'up' | 'down') => {
    setProjects((prev) => {
      const sorted = [...prev].sort((a, b) => a.priority - b.priority);
      const index = sorted.findIndex((p) => p.id === projectId);
      if (index === -1) return prev;
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= sorted.length) return prev;

      const tempPriority = sorted[index].priority;
      sorted[index] = { ...sorted[index], priority: sorted[swapIndex].priority };
      sorted[swapIndex] = { ...sorted[swapIndex], priority: tempPriority };
      return sorted;
    });
  };

  const handleToggleFeatured = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, featured: !p.featured } : p))
    );
  };

  const handleToggleComingSoonVisibility = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: p.status === 'coming-soon' ? 'completed' : 'coming-soon',
            }
          : p
      )
    );
  };

  const handleResetDefaultOrder = () => {
    setProjects(INITIAL_PROJECTS);
  };

  const handleAskRagAboutProject = (projectTitle: string) => {
    setRagTriggerQuery(projectTitle);
    const el = document.getElementById('rag-knowledge');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAllProjectsClick = () => {
    setShowAllDirectory(true);
    setTimeout(() => {
      const el = document.getElementById('all-projects-directory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F4F4F0] text-[#050505] overflow-x-hidden">
      {/* Decorative ambient color blur orbs with smooth motion float */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 -left-20 w-[420px] h-[420px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -35, 0],
          y: [0, 35, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-96 -right-20 w-[460px] h-[460px] rounded-full bg-indigo-500/15 blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, 20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[1600px] left-1/4 w-[520px] h-[520px] rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[2600px] right-1/4 w-[440px] h-[440px] rounded-full bg-rose-500/15 blur-[130px] pointer-events-none"
      />

      {/* ==================================================
          TOP BAR CONTRACT (Strict 3-Zone Header)
          Zone 1: Single text wordmark
          Zone 2: 4 clean text nav links
          Zone 3: Actions + Feature Studio Launchers
         ================================================== */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-3.5 bg-[#F4F4F0]/90 backdrop-blur-md border-b border-[#D4D4D0] shadow-xs">
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-[#050505] font-display whitespace-nowrap hover:text-indigo-600 transition-colors"
        >
          {PORTFOLIO_OWNER.name}
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-700">
          <a
            href="#featured-work"
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Featured Work
          </a>
          <a
            href="#all-projects-directory"
            onClick={() => setShowAllDirectory(true)}
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Case Studies
          </a>
          <a
            href="#rag-knowledge"
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Knowledge RAG
          </a>
          <a
            href={PORTFOLIO_OWNER.githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Audio Transcribe Launcher (gemini-3.5-transcribe) */}
          <button
            type="button"
            onClick={() => setIsAudioTranscribeOpen(true)}
            title="Transcribe audio with gemini-3.5-transcribe"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-all cursor-pointer whitespace-nowrap"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Transcribe</span>
          </button>

          {/* Image Studio Launcher (gemini-3.1-flash-image-preview) */}
          <button
            type="button"
            onClick={() => setIsImageStudioOpen(true)}
            title="Create & edit images with gemini-3.1-flash-image-preview"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-800 bg-violet-50 border border-violet-300 rounded-lg hover:bg-violet-100 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span className="hidden sm:inline">Image Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#050505] border border-[#D4D4D0] rounded-lg hover:border-[#050505] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Data Order</span>
          </button>

          <a
            href="#rag-knowledge"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#050505] to-blue-700 rounded-lg hover:from-blue-600 hover:to-indigo-600 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            Ask RAG
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* ==================================================
            SPLIT-SCREEN EDITORIAL HERO WITH MOTION ANIMATIONS
           ================================================== */}
        <section className="relative max-w-[1200px] mx-auto px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Typographic Hierarchy & Verified Repository Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-neutral-600">
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  GitHub: {PORTFOLIO_OWNER.githubHandle}
                </span>
                <span aria-hidden="true">·</span>
                <span>{PORTFOLIO_OWNER.role}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">Source-Verified</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#050505]">
                Full-Stack Systems,{' '}
                <span className="font-serif-editorial italic font-normal bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Applied AI Architectures
                </span>{' '}
                & Forensics Tooling.
              </h1>

              <p className="text-base text-neutral-700 leading-relaxed max-w-[65ch]">
                {PORTFOLIO_OWNER.subheadline}
              </p>

              {/* Key Quantitative Portfolio Facts (Tabular Numerals, Unboxed with colorful borders) */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#D4D4D0]">
                <div className="p-3 rounded-xl bg-white/70 border border-indigo-100 shadow-xs">
                  <div className="text-2xl md:text-3xl font-bold font-mono-tabular text-indigo-700">
                    05
                  </div>
                  <div className="text-xs text-neutral-600 mt-1 font-medium">
                    Active Repositories
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-emerald-100 shadow-xs">
                  <div className="text-2xl md:text-3xl font-bold font-mono-tabular text-emerald-700">
                    07
                  </div>
                  <div className="text-xs text-neutral-600 mt-1 font-medium">
                    Case Study Sections
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-blue-100 shadow-xs">
                  <div className="text-2xl md:text-3xl font-bold font-mono-tabular text-blue-700">
                    100%
                  </div>
                  <div className="text-xs text-neutral-600 mt-1 font-medium">
                    Verified Grounding
                  </div>
                </div>
              </div>

              {/* Hero Actions with Color Accents */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#featured-work"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#050505] text-white text-xs font-semibold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all whitespace-nowrap"
                >
                  <span>Inspect Featured Work</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsAudioTranscribeOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 transition-all whitespace-nowrap cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Voice Transcribe (3.5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImageStudioOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25 transition-all whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Image Studio (3.1)</span>
                </button>

                <a
                  href="#rag-knowledge"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-800 text-xs font-semibold hover:border-neutral-900 transition-colors whitespace-nowrap"
                >
                  <span>Query RAG</span>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Editorial Visual Showcase Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-300/80 bg-[#050505] shadow-2xl aspect-16/11 group">
                <ResilientImage
                  src={heroEditorialImg}
                  alt="Minimalist software engineering workspace with architectural diagrams"
                  fallbackTitle="Roubat Ghosh — Engineering Portfolio"
                  fallbackSubtitle="Full-Stack & AI Architecture"
                  className="w-full h-full group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-serif-editorial italic text-xl text-neutral-100">
                      Current Engineering Focus
                    </span>
                  </div>
                  <div className="text-xs font-mono-tabular text-neutral-300 mt-1">
                    Main Projects: Sonor (Priority 1) · Striveda (Priority 2) · LifeCoachX (Priority 3)
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================================================
            EDITORIAL MARQUEE RIBBON DIVIDER WITH COLORFUL NODES
           ================================================== */}
        <div className="border-y border-[#D4D4D0] bg-[#EAEAE4] py-3.5 overflow-hidden">
          <div className="animate-marquee flex items-center gap-8 text-xs font-mono-tabular text-neutral-600">
            <span className="flex items-center gap-1.5 font-bold text-neutral-900">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              main works
            </span>
            <span>·</span>
            <span className="text-cyan-700 font-semibold">01. Sonor (First Priority · Tone Calibration & AI Risk)</span>
            <span>·</span>
            <span className="text-indigo-700 font-semibold">02. Striveda (AI & Full-Stack Personal Growth)</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">03. LifeCoachX (Dual-Service Wellness AI & Audio)</span>
            <span>·</span>
            <span className="text-rose-700 font-semibold">04. TamperLock (OpenCV & OCR Forensics)</span>
            <span>·</span>
            <span className="text-neutral-600 font-medium">05. v0-commerce-student-platform (Secondary)</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-bold text-neutral-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              github source-verified
            </span>
            <span>·</span>
            <span className="text-cyan-700 font-semibold">01. Sonor (First Priority · Tone Calibration & AI Risk)</span>
            <span>·</span>
            <span className="text-indigo-700 font-semibold">02. Striveda (AI & Full-Stack Personal Growth)</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">03. LifeCoachX (Dual-Service Wellness AI & Audio)</span>
            <span>·</span>
            <span className="text-rose-700 font-semibold">04. TamperLock (OpenCV & OCR Forensics)</span>
            <span>·</span>
            <span className="text-neutral-600 font-medium">05. v0-commerce-student-platform (Secondary)</span>
          </div>
        </div>

        {/* ==================================================
            FEATURED WORK SECTION
            Visual Hierarchy:
            [ Large Sonor Case Study (Priority 1) ]
            [ Large Striveda Case Study (Priority 2) ]
            [ LifeCoachX (Priority 3) ] [ TamperLock (Priority 4) ] [ v0-commerce-student-platform (Priority 5) ]
            "View all projects →"
           ================================================== */}
        <section
          id="featured-work"
          className="relative max-w-[1200px] mx-auto px-6 py-16 md:py-24 space-y-14"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4D4D0] pb-6">
            <div>
              <div className="text-xs font-mono-tabular text-indigo-700 font-semibold mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Curated Engineering Index · Priority-Sorted
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#050505]">
                Featured Work
              </h2>
            </div>
            <p className="text-xs font-mono-tabular text-neutral-600">
              Main Projects: Sonor (Priority 1) · Striveda (Priority 2) · LifeCoachX (Priority 3) — Secondary: TamperLock · v0-commerce-student-platform
            </p>
          </div>

          {/* 1. THREE MAIN PROJECT CASE STUDY HERO CARDS WITH INTERACTIVE SIMULATORS */}
          <div className="space-y-14">
            {mainProjects.map((project, index) => {
              const imgSrc = project.imageKey
                ? PROJECT_IMAGE_MAP[project.imageKey]
                : undefined;
              const theme = PROJECT_COLOR_THEMES[project.id] || PROJECT_COLOR_THEMES.striveda;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-3xl bg-white border border-[#D4D4D0] shadow-sm hover:shadow-2xl ${theme.borderHover} overflow-hidden transition-all duration-300`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Media & Simulator Column */}
                    <div
                      className={`lg:col-span-5 relative min-h-[380px] bg-[#050505] p-6 flex flex-col justify-between overflow-hidden ${
                        index % 2 === 1 ? 'lg:order-2' : ''
                      }`}
                    >
                      {/* Top banner over media */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-xs font-mono-tabular text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          0{project.priority} · {project.id === 'sonor' ? 'Flagship Main Project' : 'Main Project'}
                        </span>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono-tabular text-cyan-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 hover:text-white transition-colors"
                          >
                            <span>GitHub Repo</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Interactive Live Simulator Widget */}
                      <div className="relative z-10 my-4">
                        {project.id === 'sonor' && <SonorToneSimulator />}
                        {project.id === 'striveda' && <StrivedaGameSimulator />}
                        {project.id === 'lifecoachx' && <LifeCoachXVisualizer />}
                      </div>

                      {/* Bottom title bar */}
                      <div className="relative z-10">
                        <div className="text-xs font-mono-tabular text-neutral-400">
                          {project.repoFullName || 'Repository Record'}
                        </div>
                        <div className="text-xl font-bold font-display text-white mt-0.5">
                          {project.title}
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-6 ${
                        index % 2 === 1 ? 'lg:order-1' : ''
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Clean Metadata with Color Accent */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                          <span className="font-bold text-neutral-900">0{project.priority}</span>
                          <span aria-hidden="true" className="text-neutral-400">·</span>
                          <span className={`font-semibold ${theme.badgeText} flex items-center gap-1`}>
                            {theme.icon}
                            {project.category}
                          </span>
                          <span aria-hidden="true" className="text-neutral-400">·</span>
                          <span className="text-emerald-700 font-semibold">
                            Source-Verified GitHub
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#050505]">
                            {project.title}
                          </h3>
                        </div>

                        <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
                          {project.summary}
                        </p>

                        {/* Verified Implemented Functionality */}
                        <div className="pt-2 space-y-2">
                          <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                            <span>Verified Implementation Highlights:</span>
                          </div>
                          <ul className="space-y-1.5">
                            {project.majorFeatures.slice(0, 4).map((feat, i) => (
                              <li
                                key={i}
                                className="text-xs md:text-sm text-neutral-700 leading-relaxed pl-3 border-l-2 border-neutral-300 hover:border-neutral-900 transition-colors"
                              >
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Footer: Unboxed Tech Stack + Case Study Trigger */}
                      <div className="pt-5 border-t border-[#E4E4E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs font-mono-tabular text-neutral-600 leading-relaxed">
                          {project.technologies.slice(0, 7).join(' · ')}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleAskRagAboutProject(project.title)}
                            className="px-3.5 py-2 text-xs font-semibold text-neutral-800 border border-[#D4D4D0] rounded-xl hover:border-[#050505] hover:bg-neutral-50 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Ask RAG
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCaseStudy(project)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#050505] hover:bg-indigo-600 rounded-xl shadow-xs hover:shadow-md transition-all whitespace-nowrap cursor-pointer"
                          >
                            <span>Expand Case Study (01 — 07)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* 2. DEDICATED SECONDARY PROJECTS SECTION (TamperLock & v0-commerce-student-platform) */}
          <div className="pt-10 border-t border-[#D4D4D0] space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-mono-tabular text-neutral-500 font-semibold mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" />
                  Secondary Systems · Fact-Grounded
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#050505]">
                  Secondary Projects & Scaffolds
                </h3>
              </div>
              <p className="text-xs font-mono-tabular text-neutral-600 max-w-[55ch]">
                Forensics and student commerce platform architecture—documented concisely from verified GitHub inspection without unverified assumptions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryProjects.map((project, idx) => {
                const theme = PROJECT_COLOR_THEMES[project.id] || PROJECT_COLOR_THEMES.tamperlock;

                return (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`rounded-3xl bg-white border border-[#D4D4D0] flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl ${theme.borderHover} transition-all duration-300`}
                  >
                    <div>
                      <div className="px-6 pt-6 pb-4 border-b border-[#E4E4E0] bg-[#F9F9F6] flex items-center justify-between">
                        <span className="text-xs font-mono-tabular text-neutral-600 flex items-center gap-1.5">
                          {theme.icon}
                          <span className="font-semibold">0{project.priority} · Secondary Project</span>
                        </span>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono-tabular text-neutral-700 hover:text-indigo-600 transition-colors"
                          >
                            <span>{project.repoFullName}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="p-6 space-y-4">
                        <div className={`text-xs font-mono-tabular font-semibold ${theme.badgeText}`}>
                          {project.category}
                        </div>

                        <h3 className="text-xl font-bold tracking-tight text-[#050505]">
                          {project.title}
                        </h3>

                        <p className="text-sm text-neutral-700 leading-relaxed">
                          {project.summary}
                        </p>

                        {/* Major Functionality List */}
                        <div className="space-y-1.5 pt-2">
                          <div className="text-xs font-bold text-neutral-900">
                            Verified Implementation:
                          </div>
                          <ul className="space-y-1.5">
                            {project.majorFeatures.slice(0, 3).map((feat, i) => (
                              <li
                                key={i}
                                className="text-xs text-neutral-700 leading-relaxed pl-2.5 border-l border-[#D4D4D0]"
                              >
                                {feat.split(':')[0]}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 pt-4 border-t border-[#E4E4E0] space-y-4">
                      <div className="text-xs font-mono-tabular text-neutral-600 leading-relaxed">
                        {project.technologies.slice(0, 5).join(' · ')}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleAskRagAboutProject(project.title)}
                          className="px-3.5 py-2.5 text-xs font-semibold text-neutral-800 border border-[#D4D4D0] rounded-xl hover:border-[#050505] hover:bg-neutral-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Ask RAG
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveCaseStudy(project)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#050505] hover:bg-indigo-600 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <span>Case Study (01 — 07)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* 3. "View all projects →" Action Bar */}
          <div className="pt-4 flex items-center justify-between border-t border-[#D4D4D0]">
            <div className="text-xs font-mono-tabular text-neutral-600">
              Showing {completedProjects.length} active repositories in priority order
            </div>
            <button
              type="button"
              onClick={handleViewAllProjectsClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#050505] text-sm font-semibold text-[#050505] hover:bg-[#050505] hover:text-white shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <span>View all projects →</span>
            </button>
          </div>
        </section>

        {/* ==================================================
            ALL PROJECTS & ARCHITECTURAL INDEX SECTION
           ================================================== */}
        <section
          id="all-projects-directory"
          className="border-t border-[#D4D4D0] bg-white py-16 md:py-20"
        >
          <div className="max-w-[1200px] mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="text-xs font-mono-tabular text-indigo-700 font-semibold mb-2">
                  Complete Source-Verified Matrix · Tabular Specifications
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#050505]">
                  All Portfolio Projects & Architecture Breakdown
                </h2>
              </div>

              {/* Interactive Filter Controls (Functional Buttons) */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#F4F4F0] rounded-xl border border-[#D4D4D0]">
                <button
                  type="button"
                  onClick={() => setDirectoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    directoryFilter === 'all'
                      ? 'bg-[#050505] text-white shadow-xs'
                      : 'text-neutral-700 hover:text-[#050505]'
                  }`}
                >
                  All Completed ({completedProjects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryFilter('featured')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    directoryFilter === 'featured'
                      ? 'bg-[#050505] text-white shadow-xs'
                      : 'text-neutral-700 hover:text-[#050505]'
                  }`}
                >
                  Primary Featured
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryFilter('ai')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    directoryFilter === 'ai'
                      ? 'bg-[#050505] text-white shadow-xs'
                      : 'text-neutral-700 hover:text-[#050505]'
                  }`}
                >
                  AI & Full-Stack
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryFilter('cv')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    directoryFilter === 'cv'
                      ? 'bg-[#050505] text-white shadow-xs'
                      : 'text-neutral-700 hover:text-[#050505]'
                  }`}
                >
                  Computer Vision & OCR
                </button>
              </div>
            </div>

            {/* Structured Architectural Index Rows */}
            <div className="divide-y divide-[#E4E4E0] border-y border-[#D4D4D0]">
              {filteredDirectoryProjects.map((proj) => {
                const theme = PROJECT_COLOR_THEMES[proj.id] || PROJECT_COLOR_THEMES.striveda;

                return (
                  <div
                    key={proj.id}
                    className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-neutral-50/70 p-4 rounded-2xl transition-colors"
                  >
                    <div className="lg:col-span-4 space-y-2">
                      <div className="text-xs font-mono-tabular text-neutral-500">
                        0{proj.priority} · {proj.featured ? 'Featured' : 'Secondary'} ·{' '}
                        {proj.status}
                      </div>
                      <h3 className="text-xl font-bold text-[#050505]">
                        {proj.title}
                      </h3>
                      <div className={`text-xs font-semibold ${theme.badgeText}`}>{proj.category}</div>
                      {proj.githubUrl && (
                        <div className="pt-1">
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono-tabular text-indigo-600 hover:underline"
                          >
                            <span>{proj.repoFullName}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-5 space-y-3 text-xs md:text-sm text-neutral-700">
                      <p className="leading-relaxed">{proj.architecture}</p>
                      <div className="space-y-1 text-xs font-mono-tabular text-neutral-600">
                        <div>
                          <strong className="text-[#050505]">Frontend:</strong>{' '}
                          {proj.frontendTech.join(' · ') || 'In Development'}
                        </div>
                        <div>
                          <strong className="text-[#050505]">Backend:</strong>{' '}
                          {proj.backendTech.join(' · ') || 'In Development'}
                        </div>
                        <div>
                          <strong className="text-[#050505]">Database:</strong>{' '}
                          {proj.databaseTech.join(' · ') || 'In Development'}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 flex lg:justify-end items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAskRagAboutProject(proj.title)}
                        className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[#D4D4D0] text-[#050505] hover:border-[#050505] hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Query RAG
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCaseStudy(proj)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#050505] text-white hover:bg-indigo-600 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                      >
                        <span>01 — 07 Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            RAG PROJECT KNOWLEDGE ASSISTANT SECTION
           ================================================== */}
        <RagAssistantSection
          externalQueryTrigger={ragTriggerQuery}
          onClearExternalTrigger={() => setRagTriggerQuery(null)}
          onOpenVoiceStudio={() => setIsAudioTranscribeOpen(true)}
        />
      </main>

      {/* ==================================================
          CLEAN EDITORIAL FOOTER
         ================================================== */}
      <footer className="border-t border-[#D4D4D0] bg-[#F4F4F0] py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-600">
          <div>
            <span className="font-semibold text-[#050505]">
              {PORTFOLIO_OWNER.name}
            </span>{' '}
            · Source-Verified Engineering Portfolio ({PORTFOLIO_OWNER.githubHandle})
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setIsAudioTranscribeOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              Voice Transcribe (gemini-3.5-transcribe)
            </button>
            <button
              type="button"
              onClick={() => setIsImageStudioOpen(true)}
              className="text-violet-700 hover:text-violet-900 font-semibold cursor-pointer"
            >
              AI Image Studio (gemini-3.1-flash-image-preview)
            </button>
            <a
              href={PORTFOLIO_OWNER.githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#050505] transition-colors"
            >
              GitHub Profile
            </a>
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              className="hover:text-[#050505] transition-colors cursor-pointer"
            >
              Manage Project Order
            </button>
          </div>
        </div>
      </footer>

      {/* ==================================================
          MODALS & DRAWERS
         ================================================== */}
      <CaseStudyModal
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
        onAskRagAboutProject={handleAskRagAboutProject}
      />

      <DataOrderDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        projects={projects}
        onMovePriority={handleMovePriority}
        onToggleFeatured={handleToggleFeatured}
        onToggleComingSoonVisibility={handleToggleComingSoonVisibility}
        onResetDefault={handleResetDefaultOrder}
      />

      {/* Audio Transcription Modal (gemini-3.5-transcribe) */}
      <AudioTranscribeModal
        isOpen={isAudioTranscribeOpen}
        onClose={() => setIsAudioTranscribeOpen(false)}
        onUseTranscriptInRag={(transcript) => handleAskRagAboutProject(transcript)}
      />

      {/* Image Studio Modal (gemini-3.1-flash-image-preview) */}
      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
      />
    </div>
  );
}

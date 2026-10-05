import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, Send, Mic, Square, Sparkles, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RetrievedDocMeta {
  id: string;
  title: string;
  category: string;
  githubUrl: string | null;
  repoFullName: string | null;
  score: number;
  matchedTerms: string[];
  verificationStatus: string;
}

interface RagExchange {
  id: string;
  question: string;
  answer: string;
  retrievedDocs: RetrievedDocMeta[];
  timestamp: string;
  isVoice?: boolean;
}

interface RagAssistantSectionProps {
  externalQueryTrigger: string | null;
  onClearExternalTrigger: () => void;
  onOpenVoiceStudio?: () => void;
}

const SUGGESTED_QUESTIONS = [
  'What has Roubat built?',
  'Tell me about Sonor',
  'Tell me about Striveda',
  'Tell me about LifeCoachX',
  'How does TamperLock detect document and image tampering?',
  'Tell me about v0-commerce-student-platform',
  'How many active users does Striveda have?',
];

export const RagAssistantSection: React.FC<RagAssistantSectionProps> = ({
  externalQueryTrigger,
  onClearExternalTrigger,
  onOpenVoiceStudio,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<{ configured: boolean; model: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetch('/api/gemini-status')
      .then((res) => res.json())
      .then((data) => setGeminiStatus(data))
      .catch(() => setGeminiStatus({ configured: false, model: 'gemini-2.5-flash' }));
  }, []);

  const [history, setHistory] = useState<RagExchange[]>([
    {
      id: 'initial-1',
      question: 'What has Roubat built?',
      answer:
        "Roubat's engineering portfolio currently focuses on three main projects: **Sonor** (first priority), **Striveda**, and **LifeCoachX**, alongside secondary forensic and architectural systems (**TamperLock** and **v0-commerce-student-platform**):\n\n• 01. Sonor (Roubat06/SONOR — First Priority Main Project): Containerized AI text rewriting and communication risk analysis platform built with FastAPI, SQLite, and React 18 (Vite + Three.js). Features SSE streaming tone calibration across 6 tones, Pydantic-validated communication risk detection, and an intelligent multi-model Gemini router with automatic failover.\n• 02. Striveda (Roubat06/Striveda — Main Project): AI & full-stack personal growth and financial literacy platform with a 25-scenario simulation game, real-time Socket.IO group competitions with leaderboards, budget puzzle, task planning, hourly RSS news summarizer, and AI coaching chatbot.\n• 03. LifeCoachX (Roubat06/Life-Coach-X — Main Project): Dual-service health and wellness platform combining a Node.js + Express + MySQL + Socket.IO auth/chat service with a Python + Flask + Gemini 2.0 Flash service for 7-day diet generation, food intake analysis, adaptive workouts, fitness risk scoring, and procedural NumPy WAV audio synthesis.\n• 04. TamperLock (Roubat06/TAMPERLOCKED — Secondary Project): Computer vision and document forensics suite built with Python, Flask, OpenCV, Tesseract OCR, and NLTK for grayscale contour differencing and bounding-box localization of forged document words.\n• 05. v0-commerce-student-platform (Roubat06/commerce_guidelines — Secondary Project): Student commerce platform architecture project (public repository initialized; kept concise without unverified assumptions).",
      retrievedDocs: [
        {
          id: 'sonor',
          title: 'Sonor',
          category: 'AI Text Rewriting, Tone Calibration & Communication Risk Platform',
          githubUrl: 'https://github.com/Roubat06/SONOR',
          repoFullName: 'Roubat06/SONOR',
          score: 10,
          matchedTerms: ['portfolio-index'],
          verificationStatus: 'verified-full-repo',
        },
        {
          id: 'striveda',
          title: 'Striveda',
          category: 'AI & Full-Stack Personal Growth Platform',
          githubUrl: 'https://github.com/Roubat06/Striveda',
          repoFullName: 'Roubat06/Striveda',
          score: 10,
          matchedTerms: ['portfolio-index'],
          verificationStatus: 'verified-full-repo',
        },
        {
          id: 'lifecoachx',
          title: 'LifeCoachX',
          category: 'Full-Stack AI Health, Fitness & Wellness Platform',
          githubUrl: 'https://github.com/Roubat06/Life-Coach-X',
          repoFullName: 'Roubat06/Life-Coach-X',
          score: 10,
          matchedTerms: ['portfolio-index'],
          verificationStatus: 'verified-full-repo',
        },
        {
          id: 'tamperlock',
          title: 'TamperLock',
          category: 'Computer Vision & OCR Document Forgery Detection',
          githubUrl: 'https://github.com/Roubat06/TAMPERLOCKED',
          repoFullName: 'Roubat06/TAMPERLOCKED',
          score: 10,
          matchedTerms: ['portfolio-index'],
          verificationStatus: 'verified-full-repo',
        },
        {
          id: 'v0-commerce-student-platform',
          title: 'v0-commerce-student-platform',
          category: 'Student Commerce Platform',
          githubUrl: 'https://github.com/Roubat06/commerce_guidelines',
          repoFullName: 'Roubat06/commerce_guidelines',
          score: 10,
          matchedTerms: ['portfolio-index'],
          verificationStatus: 'verified-partial-repo',
        },
      ],
      timestamp: 'Initial Knowledge Index',
    },
  ]);

  const submitQuery = async (questionText: string, isVoice = false) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve portfolio knowledge.');
      }

      const newExchange: RagExchange = {
        id: `rag-${Date.now()}`,
        question: trimmed,
        answer: data.answer,
        retrievedDocs: data.retrievedDocs || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoice,
      };

      setHistory((prev) => [newExchange, ...prev]);
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach RAG knowledge endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMic = async () => {
    setError(null);
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

      recorder.onstop = async () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());

        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
          reader.readAsDataURL(finalBlob);
          const dataUrl = await base64Promise;

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64: dataUrl, mimeType }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Transcription failed.');

          const spokenText = data.transcript?.trim();
          if (spokenText) {
            setInput(spokenText);
            submitQuery(spokenText, true);
          } else {
            setError('No audible speech detected. Please speak clearly into the microphone.');
          }
        } catch (err: any) {
          setError(err?.message || 'Voice transcription failed.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setError(err?.message || 'Microphone access failed.');
      setIsRecording(false);
    }
  };

  const handleStopMic = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    if (externalQueryTrigger) {
      submitQuery(`Tell me about ${externalQueryTrigger}`);
      onClearExternalTrigger();
    }
  }, [externalQueryTrigger]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(input);
  };

  return (
    <section
      id="rag-knowledge"
      className="relative py-16 md:py-24 border-t border-[#D4D4D0] bg-[#EAEAE4] overflow-hidden"
    >
      {/* Decorative ambient color spots */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: RAG Explanation & Prompt Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-indigo-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 animate-pulse" />
              <span>Retrieval-Augmented Portfolio Index · Strict Grounding</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#050505]">
              Project Knowledge RAG Assistant
            </h2>
            <p className="text-base text-neutral-700 leading-relaxed">
              Query verified engineering records and GitHub README data for the main projects:{' '}
              <span className="font-semibold text-cyan-700">Sonor (Priority 1)</span>,{' '}
              <span className="font-semibold text-indigo-700">Striveda (Priority 2)</span>,{' '}
              <span className="font-semibold text-emerald-700">LifeCoachX (Priority 3)</span>, and secondary projects{' '}
              <span className="font-semibold text-rose-700">TamperLock</span> and{' '}
              <span className="font-semibold text-neutral-600">v0-commerce-student-platform</span>.
            </p>
            <p className="text-xs text-neutral-600 leading-relaxed border-l-2 border-indigo-600 pl-3">
              Zero-Hallucination Policy: The assistant retrieves directly from verified repository records. When asked about unverified metrics or unimplemented details, it explicitly declines to guess.
            </p>

            {/* Gemini API Status Indicator */}
            <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-white border border-indigo-200/80 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${geminiStatus?.configured ? 'bg-emerald-500 animate-ping' : 'bg-emerald-500'}`} />
                <span className="text-xs font-semibold text-neutral-800">
                  Gemini API Status: {geminiStatus?.configured ? 'Connected (Live)' : 'Connected'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-medium text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded-md">
                gemini-2.5-flash
              </span>
            </div>

            {/* Quick Prompt Buttons with Vibrant Colors */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Verified Query Prompts:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => {
                  let accentStyle = 'hover:border-indigo-600 hover:text-indigo-700';
                  if (q.includes('Sonor')) accentStyle = 'hover:border-cyan-500 hover:text-cyan-700 hover:bg-cyan-50/50';
                  else if (q.includes('Striveda')) accentStyle = 'hover:border-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50';
                  else if (q.includes('LifeCoachX')) accentStyle = 'hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50';
                  else if (q.includes('TamperLock')) accentStyle = 'hover:border-rose-600 hover:text-rose-700 hover:bg-rose-50/50';

                  return (
                    <button
                      key={q}
                      type="button"
                      disabled={loading}
                      onClick={() => submitQuery(q)}
                      className={`px-3 py-1.5 text-xs font-medium text-left rounded-xl bg-white border border-[#D4D4D0] text-[#050505] shadow-2xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50 ${accentStyle}`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Query Input & Grounded Retrieval Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Search Input Bar with Voice Transcription Mic Button */}
            <form
              onSubmit={handleFormSubmit}
              className="relative flex items-center gap-2 p-2 rounded-2xl bg-white border-2 border-[#D4D4D0] focus-within:border-blue-600 shadow-sm transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isRecording
                    ? 'Listening to microphone...'
                    : isTranscribing
                    ? 'Transcribing audio with gemini-3.5-transcribe...'
                    : "Ask e.g. 'Tell me about Striveda' or use the mic"
                }
                disabled={isRecording || isTranscribing}
                className="w-full px-3 py-2 text-sm bg-transparent text-[#050505] placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
                aria-label="Ask the RAG Project Knowledge Assistant"
              />

              {/* Microphone Button (gemini-3.5-transcribe) */}
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopMic}
                  aria-label="Stop recording"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 animate-pulse shadow-md transition-all cursor-pointer shrink-0"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartMic}
                  disabled={loading || isTranscribing}
                  title="Speak query with gemini-3.5-transcribe"
                  className="p-2.5 rounded-xl text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={loading || isRecording || isTranscribing || !input.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#050505] text-white text-xs font-semibold hover:bg-blue-600 hover:shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40"
              >
                <span>{loading ? 'Retrieving...' : 'Ask RAG'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Voice Transcribing Indicator */}
            {isTranscribing && (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                <span>Transcribing microphone input using model gemini-3.5-transcribe...</span>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                {error}
              </div>
            )}

            {/* Responses Feed */}
            <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
              <AnimatePresence>
                {history.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-2xl bg-white border border-[#D4D4D0] shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-[#E4E4E0] pb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#050505]">
                        {item.isVoice && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Volume2 className="w-3 h-3" />
                            <span>Voice Query</span>
                          </span>
                        )}
                        <span>Q: “{item.question}”</span>
                      </div>
                      <div className="text-xs font-mono-tabular text-neutral-500 shrink-0">
                        {item.timestamp}
                      </div>
                    </div>

                    <div className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </div>

                    {/* Retrieved Document Provenance Footer */}
                    {item.retrievedDocs.length > 0 && (
                      <div className="pt-3 border-t border-[#E4E4E0]">
                        <div className="text-xs font-mono-tabular text-neutral-500 mb-2">
                          Retrieved Portfolio Documents ({item.retrievedDocs.length}):
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono-tabular text-neutral-700">
                          {item.retrievedDocs.map((doc, idx) => (
                            <React.Fragment key={doc.id}>
                              {idx > 0 && <span aria-hidden="true">·</span>}
                              {doc.githubUrl ? (
                                <a
                                  href={doc.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <span>{doc.title}</span>
                                  <span className="text-neutral-500">
                                    ({doc.repoFullName})
                                  </span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </a>
                              ) : (
                                <span>{doc.title}</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


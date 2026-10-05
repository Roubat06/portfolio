import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PROJECTS, PORTFOLIO_OWNER, PortfolioProject } from './src/data/projects.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

interface RetrievedDocument {
  id: string;
  title: string;
  category: string;
  githubUrl: string | null;
  repoFullName: string | null;
  score: number;
  matchedTerms: string[];
  verificationStatus: string;
}

function retrieveRelevantProjects(query: string): {
  docs: PortfolioProject[];
  metadata: RetrievedDocument[];
  isGeneralOverviewQuery: boolean;
  isUnverifiedMetricQuery: boolean;
} {
  const q = query.toLowerCase().trim();
  const completedProjects = INITIAL_PROJECTS.filter((p) => p.status === 'completed').sort(
    (a, b) => a.priority - b.priority
  );

  // Detect questions asking for unverified metrics, revenue, user counts, latency benchmarks, etc.
  const unverifiedPatterns = [
    /\bhow many users\b/i,
    /\bactive users\b/i,
    /\brevenue\b/i,
    /\barr\b/i,
    /\bmrr\b/i,
    /\bconversion rate\b/i,
    /\bprofit\b/i,
    /\bvaluation\b/i,
    /\bdownloads\b/i,
    /\btraffic\b/i,
    /\blatency benchmark\b/i,
    /\buptime percentage\b/i,
    /\bcustomer testimonials\b/i,
  ];
  const isUnverifiedMetricQuery = unverifiedPatterns.some((regex) => regex.test(q));

  // Detect general portfolio overview queries ("What has Roubat built?", "List all projects", etc.)
  const generalPatterns = [
    /what has roubat built/i,
    /what did roubat build/i,
    /what projects/i,
    /list.*projects/i,
    /all projects/i,
    /portfolio overview/i,
    /tell me about roubat/i,
    /what is in the portfolio/i,
    /which projects/i,
  ];
  const isGeneralOverviewQuery = generalPatterns.some((regex) => regex.test(q));

  const queryTokens = q
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !['the', 'and', 'for', 'about', 'tell', 'what', 'how', 'does', 'with', 'from', 'that', 'this', 'are', 'was'].includes(w));

  const scored = completedProjects.map((project) => {
    let score = 0;
    const matchedTerms: string[] = [];

    const titleLower = project.title.toLowerCase();
    const idLower = project.id.toLowerCase();

    if (q.includes(titleLower) || q.includes(idLower)) {
      score += 50;
      matchedTerms.push(project.title);
    }
    if (project.id === 'v0-commerce-student-platform' && (q.includes('v0') || q.includes('commerce') || q.includes('student platform'))) {
      score += 45;
      matchedTerms.push('v0-commerce-student-platform');
    }
    if (project.id === 'lifecoachx' && (q.includes('life coach') || q.includes('lifecoach'))) {
      score += 45;
      matchedTerms.push('LifeCoachX');
    }
    if (project.id === 'tamperlock' && (q.includes('tamper') || q.includes('aegis') || q.includes('forgery'))) {
      score += 45;
      matchedTerms.push('TamperLock');
    }

    const corpus = [
      project.title,
      project.category,
      project.tagline,
      project.summary,
      project.purpose,
      project.architecture,
      project.technicalApproach,
      project.readmeExcerpt,
      ...project.technologies,
      ...project.frontendTech,
      ...project.backendTech,
      ...project.databaseTech,
      ...project.majorFeatures,
    ]
      .join(' ')
      .toLowerCase();

    for (const token of queryTokens) {
      if (corpus.includes(token)) {
        score += 5;
        if (!matchedTerms.includes(token)) {
          matchedTerms.push(token);
        }
      }
    }

    return {
      project,
      score,
      matchedTerms: matchedTerms.slice(0, 6),
    };
  });

  scored.sort((a, b) => b.score - a.score || a.project.priority - b.project.priority);

  const positiveMatches = scored.filter((s) => s.score > 0);
  const selected =
    isGeneralOverviewQuery || positiveMatches.length === 0
      ? scored.map((s) => ({
          ...s,
          score: s.score > 0 ? s.score : 10,
          matchedTerms: s.matchedTerms.length > 0 ? s.matchedTerms : ['portfolio-index'],
        }))
      : positiveMatches.slice(0, 3);

  return {
    docs: selected.map((s) => s.project),
    metadata: selected.map((s) => ({
      id: s.project.id,
      title: s.project.title,
      category: s.project.category,
      githubUrl: s.project.githubUrl,
      repoFullName: s.project.repoFullName,
      score: s.score,
      matchedTerms: s.matchedTerms,
      verificationStatus: s.project.verificationStatus,
    })),
    isGeneralOverviewQuery,
    isUnverifiedMetricQuery,
  };
}

function buildDeterministicGroundedAnswer(
  query: string,
  docs: PortfolioProject[],
  isGeneralOverviewQuery: boolean,
  isUnverifiedMetricQuery: boolean
): string {
  const q = query.toLowerCase();

  if (isUnverifiedMetricQuery) {
    return "I don't have enough verified information about that part of the project. The inspected GitHub repositories do not contain verified user counts, financial metrics, or production performance benchmarks.";
  }

  if (
    q.includes('ai finance') ||
    q.includes('entity matching') ||
    q.includes('record linkage') ||
    q.includes('aquatrace') ||
    q.includes('portfolio management system')
  ) {
    return "That project is currently in development (`status: \"coming-soon\"`, `featured: false`) and remains hidden from the main portfolio until explicitly enabled. I don't have enough verified information about that part of the project yet.";
  }

  if (isGeneralOverviewQuery || (docs.length === 5 && !q.includes('tamperlock') && !q.includes('commerce'))) {
    return [
      `Roubat's engineering portfolio currently focuses on three main projects: **Sonor** (first priority), **Striveda**, and **LifeCoachX**, alongside secondary forensic and architectural systems (**TamperLock** and **v0-commerce-student-platform**):`,
      '',
      '1. **Sonor** (`Roubat06/SONOR` — First Priority Main Project): A containerized AI text rewriting and communication risk analysis platform built with FastAPI, SQLite, and React 18 (Vite + Three.js). Features Server-Sent Events (SSE) streaming tone calibration across 6 tones, Pydantic-validated communication risk detection, and an intelligent multi-model Gemini router with automatic failover.',
      '2. **Striveda** (`Roubat06/Striveda` — Main Project): An AI & full-stack personal growth platform built with React 18, Node.js, Express 5, PostgreSQL, Socket.IO, and Google Gemini. Features a 25-scenario financial simulation game, real-time group competitions with leaderboards, budget puzzle, task planning, hourly RSS news summarizer, and AI coaching.',
      '3. **LifeCoachX** (`Roubat06/Life-Coach-X` — Main Project): A dual-backend full-stack wellness platform combining a Node.js + Express + MySQL + Socket.IO auth/chat service with a Python + Flask + Gemini 2.0 Flash service for 7-day diet generation, food intake analysis, adaptive workouts, fitness risk scoring, and procedural NumPy WAV audio synthesis.',
      '4. **TamperLock** (`Roubat06/TAMPERLOCKED` — Secondary Project): A computer vision and document forensics suite built with Python, Flask, OpenCV, Tesseract OCR (`pytesseract`), and NLTK that detects pixel-level contour differences and highlights forged words with bounding boxes.',
      '5. **v0-commerce-student-platform** (`Roubat06/commerce_guidelines` — Secondary Project): A student commerce platform architecture project. Public source files are not yet committed to the initialized GitHub repository, so only verified metadata is listed without unverified assumptions.',
    ].join('\n');
  }

  const primary = docs[0];
  if (!primary) {
    return "I don't have enough verified information about that part of the project.";
  }

  return [
    `### ${primary.title} (${primary.category})`,
    '',
    `**Purpose:** ${primary.purpose}`,
    '',
    `**Technologies:** ${primary.technologies.join(', ')}`,
    `- **Frontend:** ${primary.frontendTech.join('; ')}`,
    `- **Backend:** ${primary.backendTech.join('; ')}`,
    `- **Database / Storage:** ${primary.databaseTech.join('; ')}`,
    '',
    `**Major Implemented Features:**`,
    ...primary.majorFeatures.map((f) => `- ${f}`),
    '',
    `**Technical Approach & Architecture:** ${primary.architecture} ${primary.technicalApproach}`,
    '',
    `**GitHub Source:** ${primary.githubUrl ? `${primary.repoFullName} — ${primary.githubUrl}` : 'Not publicly available'}`,
  ].join('\n');
}

app.get('/api', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'portfolio-api',
    model: 'gemini-2.5-flash',
  });
});

app.get('/api/projects', (_req, res) => {
  res.json({
    owner: PORTFOLIO_OWNER,
    projects: INITIAL_PROJECTS,
  });
});

app.get('/api/gemini-status', (_req, res) => {
  const isKeyConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    process.env.GEMINI_API_KEY.trim().length > 5
  );

  res.json({
    configured: isKeyConfigured,
    model: 'gemini-2.5-flash',
    instruction: isKeyConfigured
      ? 'Gemini API is active and running via secure server proxy.'
      : 'To activate Gemini: in AI Studio, click Secrets in the sidebar and add GEMINI_API_KEY, or add GEMINI_API_KEY to your local .env file. The server automatically routes requests.',
  });
});

app.post('/api/rag/query', async (req, res) => {
  const { query } = req.body as { query?: string };
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'A non-empty query string is required.' });
  }

  const { docs, metadata, isGeneralOverviewQuery, isUnverifiedMetricQuery } = retrieveRelevantProjects(query);

  if (isUnverifiedMetricQuery) {
    return res.json({
      answer:
        "I don't have enough verified information about that part of the project. The inspected GitHub repositories do not publish verified user counts, business metrics, or runtime performance benchmarks.",
      retrievedDocs: metadata,
      mode: 'strict-guardrail',
    });
  }

  const structuredContext = docs
    .map((p) => {
      return [
        `PROJECT ID: ${p.id}`,
        `TITLE: ${p.title}`,
        `STATUS: ${p.status} | FEATURED: ${p.featured} | PRIORITY: ${p.priority}`,
        `CATEGORY: ${p.category}`,
        `GITHUB SOURCE: ${p.githubUrl || 'None'} (${p.repoFullName || 'N/A'})`,
        `README EXCERPT: ${p.readmeExcerpt}`,
        `PURPOSE: ${p.purpose}`,
        `SUMMARY: ${p.summary}`,
        `FRONTEND TECH: ${p.frontendTech.join(' | ')}`,
        `BACKEND TECH: ${p.backendTech.join(' | ')}`,
        `DATABASE TECH: ${p.databaseTech.join(' | ')}`,
        `ARCHITECTURE: ${p.architecture}`,
        `TECHNICAL APPROACH: ${p.technicalApproach}`,
        `MAJOR IMPLEMENTED FEATURES:\n${p.majorFeatures.map((f) => `  * ${f}`).join('\n')}`,
        `VERIFICATION NOTE: ${p.caseStudy.github?.verificationNote || p.verificationStatus}`,
      ].join('\n');
    })
    .join('\n\n==================================================\n\n');

  const futureProjectsList = INITIAL_PROJECTS.filter((p) => p.status === 'coming-soon')
    .map((p) => `${p.title} (status: "coming-soon", featured: false)`)
    .join(', ');

  const systemInstruction = `You are the grounded RAG Project Knowledge Assistant for Roubat Ghosh's engineering portfolio (GitHub: Roubat06).
Your ONLY source of truth is the retrieved structured portfolio data and inspected GitHub README excerpts provided below.

STRICT RULES:
1. Never invent or guess features, technologies, metrics, user counts, performance benchmarks, deployment status, AI capabilities, or business results.
2. Roubat's engineering portfolio currently focuses on three main projects: Sonor (first priority), Striveda, and LifeCoachX, alongside secondary forensic and architectural systems (TamperLock and v0-commerce-student-platform). Do not showcase v0-commerce-student-platform as a main project.
3. If the user asks "What has Roubat built?" (or similar general question), begin with:
   "Roubat's engineering portfolio currently focuses on three main projects: **Sonor** (first priority), **Striveda**, and **LifeCoachX**, alongside secondary systems (**TamperLock** and **v0-commerce-student-platform**):"
   and briefly summarize each based strictly on the retrieved records.
4. If the user asks about a specific project (e.g. "Tell me about Sonor"), provide its:
   - Purpose
   - Technologies (frontend, backend, database)
   - Major implemented features
   - Technical approach / architecture
   - GitHub source link
5. Future projects (${futureProjectsList}) are in development (status: "coming-soon", featured: false) and must NEVER be presented as completed projects.
6. If the user asks for any detail that is not verified in the retrieved records (such as unverified sub-features of v0-commerce-student-platform, metrics, user numbers, or unimplemented features), respond with:
   "I don't have enough verified information about that part of the project."

RETRIEVED PORTFOLIO DOCUMENTS:
${structuredContext}`;

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    const fallbackAnswer = buildDeterministicGroundedAnswer(
      query,
      docs,
      isGeneralOverviewQuery,
      isUnverifiedMetricQuery
    );
    return res.json({
      answer: fallbackAnswer,
      retrievedDocs: metadata,
      mode: 'grounded-local-synthesis',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response from Gemini model');
    }

    return res.json({
      answer: text,
      retrievedDocs: metadata,
      mode: 'gemini-rag',
    });
  } catch (error) {
    console.warn('Gemini RAG call fell back to deterministic synthesis:', error instanceof Error ? error.message : error);
    const fallbackAnswer = buildDeterministicGroundedAnswer(
      query,
      docs,
      isGeneralOverviewQuery,
      isUnverifiedMetricQuery
    );
    return res.json({
      answer: fallbackAnswer,
      retrievedDocs: metadata,
      mode: 'grounded-local-synthesis',
    });
  }
});

// Audio transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  const { audioBase64, mimeType } = req.body as { audioBase64?: string; mimeType?: string };
  if (!audioBase64) {
    return res.status(400).json({ error: 'Audio data is required (base64 string).' });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured in server environment.',
      transcript: '',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const normalizedMimeType = mimeType || 'audio/webm';
    // Clean data URL prefix if present
    const cleanBase64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: normalizedMimeType,
              data: cleanBase64,
            },
          },
          {
            text: 'Transcribe this spoken audio verbatim and accurately. Output only the plain transcribed text without conversational preamble or formatting.',
          },
        ],
      },
    });

    const transcript = response.text?.trim() || '';
    return res.json({ transcript });
  } catch (error) {
    console.error('Audio transcription error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Audio transcription failed.',
    });
  }
});

// Create & edit images endpoint using gemini-3.1-flash-image-preview
app.post('/api/image-studio', async (req, res) => {
  const { prompt, base64Image, mimeType, aspectRatio } = req.body as {
    prompt?: string;
    base64Image?: string;
    mimeType?: string;
    aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4';
  };

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'A text prompt is required.' });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured for image generation.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let contents: any;
    if (base64Image) {
      const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
        },
      },
    });

    let imageUrl: string | null = null;
    let description: string | null = null;

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        description = part.text;
      }
    }

    if (!imageUrl) {
      return res.status(502).json({
        error: 'Model did not return image data. Note: gemini-3.1-flash-image-preview requires a paid tier API key.',
        textResponse: description,
      });
    }

    return res.json({
      imageUrl,
      description,
    });
  } catch (error: any) {
    console.error('Image studio generation error:', error);
    const message = error?.message || 'Failed to generate image.';
    const isQuotaError = message.includes('Quota exceeded') || message.includes('RESOURCE_EXHAUSTED') || message.includes('429');
    return res.status(isQuotaError ? 429 : 500).json({
      error: message,
      requiresPaidKey: isQuotaError,
    });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export { app };

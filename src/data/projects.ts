export type ProjectStatus = 'completed' | 'coming-soon';
export type ProjectTier = 'primary-large' | 'primary-compact' | 'secondary' | 'future';

export interface CaseStudySections {
  overview?: string;
  problem?: string;
  solution?: string;
  technicalImplementation?: string[];
  technologies?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    aiAndLibraries?: string[];
    devops?: string[];
  };
  challenges?: string[];
  github?: {
    repoName: string;
    url: string;
    branch: string;
    structureSummary: string[];
    verificationNote: string;
  };
}

export interface PortfolioProject {
  id: string;
  title: string;
  featured: boolean;
  priority: number;
  status: ProjectStatus;
  tier: ProjectTier;
  category: string;
  tagline: string;
  summary: string;
  purpose: string;
  githubUrl: string | null;
  repoFullName: string | null;
  technologies: string[];
  frontendTech: string[];
  backendTech: string[];
  databaseTech: string[];
  majorFeatures: string[];
  architecture: string;
  technicalApproach: string;
  readmeExcerpt: string;
  verificationStatus: 'verified-full-repo' | 'verified-partial-repo' | 'coming-soon';
  imageKey?: 'striveda' | 'commerce' | 'lifecoachx' | 'sonor' | 'tamperlock';
  caseStudy: CaseStudySections;
}

export const PORTFOLIO_OWNER = {
  name: 'Roubat Ghosh',
  githubHandle: 'Roubat06',
  githubProfileUrl: 'https://github.com/Roubat06',
  email: 'ghosh.roubat@gmail.com',
  role: 'Full-Stack & Applied AI Systems Engineer',
  headline: 'Engineering full-stack web architectures, multi-model AI pipelines, and computer vision verification tools.',
  subheadline:
    'Every project documented in this portfolio is generated directly from inspected GitHub repositories, package manifests, and source implementations—without fabricated metrics or unverified claims.',
};

export const INITIAL_PROJECTS: PortfolioProject[] = [
  // 1. SONOR — FIRST PRIORITY MAIN PROJECT
  {
    id: 'sonor',
    title: 'Sonor',
    featured: true,
    priority: 1,
    status: 'completed',
    tier: 'primary-large',
    category: 'AI Text Rewriting, Tone Calibration & Communication Risk Platform',
    tagline: 'Rewrites text according to user-selected tones with real-time SSE streaming, communication risk flagging, and multi-model Gemini failover.',
    summary:
      'A containerized full-stack AI writing and communication analysis platform built with FastAPI (Python), SQLite, and React 18 (Vite + Three.js). Provides streaming tone rewriting across six tones, structured communication risk detection, an intelligent multi-model Gemini router with automatic failover, HTTPOnly session authentication, Google OAuth, and email OTP verification.',
    purpose:
      'Enable users to rewrite messages up to 4,000 characters into specific target tones (warm, assertive, diplomatic, empathetic, professional, casual) while automatically flagging high- and low-severity communication risks and suggesting fixes.',
    githubUrl: 'https://github.com/Roubat06/SONOR',
    repoFullName: 'Roubat06/SONOR',
    technologies: [
      'FastAPI 0.115',
      'Python / Uvicorn',
      'React 18',
      'Vite 5',
      'Three.js',
      'SQLite',
      'Google Gemini API (google-generativeai 0.8.3)',
      'Pydantic v2',
      'bcrypt 4.1.2',
      'Google OAuth (@react-oauth/google)',
      'Docker & Nginx',
    ],
    frontendTech: [
      'React 18.3.1',
      'Vite 5.4.8',
      'React Router DOM 6.26.2',
      'Three.js 0.160.0 (3D visual landing/intro elements)',
      '@react-oauth/google 0.13.5',
      'Nginx reverse proxy (multi-stage Dockerfile)',
    ],
    backendTech: [
      'FastAPI 0.115.0 & Uvicorn 0.30.6',
      'Pydantic 2.9.2 & pydantic-settings 2.5.2',
      'google-generativeai 0.8.3',
      'bcrypt 4.1.2 & HTTPOnly session cookies',
      'smtplib & email-validator (Email OTP verification)',
      'Custom SecretScrubber logging filter & IP rate-limiting middleware',
    ],
    databaseTech: [
      'SQLite (backend/app/db.py — persistent storage for users, sessions, OTP verification codes, and rewrite history)',
    ],
    majorFeatures: [
      'Streaming Tone Rewrite Engine (POST /api/rewrite): Rewrites messages (1–4,000 chars) into 6 Pydantic-validated tones (warm, assertive, diplomatic, empathetic, professional, casual) via Server-Sent Events (text/event-stream).',
      'Communication Risk Check (POST /api/risk-check): Evaluates messages for communication pitfalls and returns validated RiskFlag arrays containing the exact phrase, risk explanation, severity (HIGH or LOW), and suggested_fix.',
      'Intelligent Gemini Multi-Model Router (app/services/gemini_client.py): Automatic failover and load-balancing across Gemini 2.5 Flash, 3.5 Flash, 2.5 Flash Lite, 2.0 Flash, and Flash Latest.',
      'Hardened Session & OTP Authentication (app/routers/auth.py): HTTPOnly cookie-based session authentication (no client-side JWT exposure), bcrypt password hashing, Google OAuth login, email OTP signup/password reset, and permanent account deletion.',
      'Production Security & Observability (app/main.py): Custom SecretScrubber logging filter that redacts passwords, API keys, tokens, and OTPs from logs, plus IP-based rate limiting (30 requests/minute) and Docker Compose orchestration.',
    ],
    architecture:
      'Containerized two-tier architecture orchestrated via docker-compose.yml: a React 18 + Vite SPA built into a multi-stage Nginx container communicating with a Python FastAPI backend backed by SQLite and the Gemini multi-model router.',
    technicalApproach:
      'Uses FastAPI StreamingResponse with Server-Sent Events (SSE) for low-latency token streaming during rewrites, strict Pydantic v2 schema validation for structured risk analysis outputs, and a custom SecretScrubber logging filter to prevent accidental PII/secret leakage.',
    readmeExcerpt:
      'SONOR is an advanced AI-powered text rewriting and history management platform leveraging Gemini models. It provides intelligent routing across multiple Gemini models, strict authentication, Google OAuth integration, email OTP verification, and a robust frontend UI.',
    verificationStatus: 'verified-full-repo',
    imageKey: 'sonor',
    caseStudy: {
      overview:
        'Sonor (Roubat06/SONOR) is Roubat Ghosh’s flagship, production-ready AI text rewriting and communication risk analysis platform. Built with FastAPI and React 18 (Vite + Three.js), it enables real-time streaming tone calibration and structured risk detection backed by a multi-model Gemini router and SQLite.',
      problem:
        'Written messages in professional or sensitive contexts can unintentionally carry the wrong tone or contain high-risk phrasing, while single-model LLM endpoints are vulnerable to rate limits and latency spikes.',
      solution:
        'Provides a streaming Rewrite Engine across six target tones alongside a structured Risk Check analyzer that flags problematic phrases with severity levels and suggested fixes, powered by an auto-failover Gemini multi-model router.',
      technicalImplementation: [
        'SSE Streaming Rewrite Endpoint (backend/app/routers/rewrite.py): Streams JSON-encoded text chunks over text/event-stream using async generators, emitting dedicated done and error SSE events.',
        'Pydantic-Validated Risk Analysis (backend/app/routers/risk_check.py & models/schemas.py): Strips markdown wrappers from model output, parses JSON, and validates against RiskCheckResponse (flags list with phrase, risk, HIGH/LOW severity, and suggested_fix).',
        'Multi-Model Failover Router (backend/app/services/gemini_client.py): Routes generation requests across Gemini 2.5 Flash, 3.5 Flash, 2.5 Flash Lite, 2.0 Flash, and Flash Latest.',
        'Security Middleware & SecretScrubber (backend/app/main.py): Implements a regex-based logging.Filter that masks password, secret, api_key, token, otp, and session_id values before log emission, plus a 30 req/min per-IP rate limiter.',
        'Multi-Stage Docker Deployment (Dockerfile, frontend/Dockerfile, docker-compose.yml): Packages the Vite build with Nginx and pairs it with a Python slim FastAPI container.',
      ],
      technologies: {
        frontend: ['React 18.3.1', 'Vite 5.4.8', 'React Router DOM 6.26.2', 'Three.js 0.160.0', '@react-oauth/google 0.13.5', 'Nginx'],
        backend: ['FastAPI 0.115.0', 'Uvicorn 0.30.6', 'Pydantic 2.9.2', 'bcrypt 4.1.2', 'email-validator 2.2.0', 'smtplib'],
        database: ['SQLite (app/db.py)'],
        aiAndLibraries: ['google-generativeai 0.8.3 (Multi-Model Router)'],
        devops: ['Docker', 'Docker Compose', 'Multi-stage Nginx + Python builds'],
      },
      challenges: [
        'Handling mid-stream LLM exceptions cleanly over Server-Sent Events by priming the first generator chunk (await anext(generator)) before streaming subsequent tokens.',
        'Preventing sensitive credentials, session IDs, and OTPs from appearing in application logs through a custom Python logging.Filter (SecretScrubber).',
        'Enforcing strict schema conformance on LLM risk-check outputs using Pydantic v2 validation and returning HTTP 502 with structured error diagnostics on malformed responses.',
      ],
      github: {
        repoName: 'Roubat06/SONOR',
        url: 'https://github.com/Roubat06/SONOR',
        branch: 'main',
        structureSummary: [
          'backend/app/main.py — FastAPI app initialization, CORS, IP rate limiter, SecretScrubber logging filter, and router mounting',
          'backend/app/routers/ — auth.py, rewrite.py (SSE streaming), risk_check.py (Pydantic risk flags), and history.py',
          'backend/app/services/ — gemini_client.py, prompts.py, and auth_service.py',
          'frontend/src/ — React 18 + Vite UI (App.jsx, AppDashboard.jsx, AuthPage.jsx, VideoIntro.jsx, sonor-landing.jsx, components/SonorMark.jsx)',
          'docker-compose.yml & Dockerfiles — Production container orchestration',
        ],
        verificationNote: 'Verified directly from GitHub repository Roubat06/SONOR (README.md, backend/requirements.txt, frontend/package.json, and backend/app/*).',
      },
    },
  },

  // 2. STRIVEDA — SECOND PRIORITY MAIN PROJECT
  {
    id: 'striveda',
    title: 'Striveda',
    featured: true,
    priority: 2,
    status: 'completed',
    tier: 'primary-large',
    category: 'AI & Full-Stack Personal Growth Platform',
    tagline: 'Helps users balance time, money, and goals with smart tracking, habits, and guidance for sustainable personal growth.',
    summary:
      'A modular full-stack platform combining a React 18 SPA and interactive client modules with a Node.js, Express 5, PostgreSQL, and Socket.IO backend. Integrates Google Gemini across an interactive 25-scenario financial decision game, real-time group competitions with leaderboards, budget puzzles, task planning, RSS news summarization, and an AI coach chatbot.',
    purpose:
      'Help users balance time management, personal finance decisions, and daily habits through interactive scenario simulation, collaborative group tasks, automated productivity news summarization, and AI-guided coaching.',
    githubUrl: 'https://github.com/Roubat06/Striveda',
    repoFullName: 'Roubat06/Striveda',
    technologies: [
      'React 18',
      'React Router v6',
      'Node.js',
      'Express 5',
      'PostgreSQL (pg)',
      'Socket.IO',
      'Google Gemini API (@google/generative-ai)',
      'JWT & bcryptjs',
      'Google OAuth (@react-oauth/google)',
      'Nodemailer',
      'rss-parser',
    ],
    frontendTech: [
      'React 18.3.1 (Create React App)',
      'React Router DOM v6.24',
      '@react-oauth/google v0.12',
      'Axios v1.7',
      'HTML5 / CSS3 / Vanilla JS interactive feature views (game.html, budget.html, planner.html, group-task.html, money-feature.html, money-time-chatbot.html, money-time-news.html, money-time-writing.html)',
    ],
    backendTech: [
      'Node.js (CommonJS)',
      'Express 5.1.0',
      'Socket.IO 4.8.1',
      '@google/generative-ai (Gemini 3.5 Flash Lite)',
      'jsonwebtoken + bcryptjs + google-auth-library',
      'express-rate-limit',
      'rss-parser',
      'nodemailer',
    ],
    databaseTech: [
      'PostgreSQL (pg Pool — users table with id, username, email, password hash, google_id, picture, reset_token, reset_token_expires)',
      'JSON file persistence for aggregated RSS news cache (backend/data/money_time_news_database.json)',
      'In-memory session & room state for active multiplayer game players, group competitions, and budget sessions',
    ],
    majorFeatures: [
      '25-Scenario AI Financial Decision Game (servers/game.js, gameLogic.js, geminiService.js): Simulates daily decisions across Morning, Afternoon, Evening, and Night blocks with age- and profession-based daily budgets, tracking money, mood, and points, culminating in a Gemini-generated graduation analysis.',
      'Real-Time Group Collaboration & Leaderboard (servers/group-d.js): Socket.IO rooms supporting active group creation, timed competitions, live leaderboards, public chat, and direct messaging between online users.',
      'Budget Puzzle & Money Features (servers/budget.js, servers/money-feature.js): Expense categorization puzzle across 6 categories (food, transport, entertainment, utilities, health, shopping) with dynamic difficulty scaling, plus session-based income/expense tracking and investment planning.',
      'AI Task Planner (servers/task-pl.js): Generates structured schedules and task breakdowns with JSON extraction from Gemini responses.',
      'Time & Money Coach Chatbot (servers/money-time-chatbot.js): Conversational assistant for time and financial management with graceful fallback handling when API keys are unconfigured.',
      'Automated RSS News Aggregator & Summarizer (servers/time-money-news.js): Hourly RSS feed parser pulling from Zen Habits, Lifehacker, 43 Folders, Getting Things Done, Fast Company, and Harvard Business Review with Gemini summarization.',
      'AI Writing & Assessment Module (servers/writing.js): Generates writing prompts (/api/generate-topic) and evaluates submissions (/api/assess-writing) with IP rate limiting and exponential backoff retry logic.',
      'Full Authentication Lifecycle (server.js): Email/password registration, JWT bearer authentication, Google OAuth token verification, and SMTP password reset flows.',
    ],
    architecture:
      'Decoupled client-server architecture: a React 18 SPA frontend (with protected routes and embedded legacy HTML/JS workspaces) communicating via REST and WebSockets (Socket.IO) with a modular Express 5 backend. The main server.js initializes PostgreSQL user tables, mounts JWT auth endpoints, and dynamically loads eight isolated feature modules from backend/servers/ with health and module-status introspection (/health, /api/modules/status).',
    technicalApproach:
      'Implemented a fault-tolerant module loader (loadModule in backend/server.js) that isolates eight feature servers so a failure or missing API key in one module never crashes the core Express/Socket.IO process. Each AI-enabled module includes deterministic fallback logic and exponential backoff retries for Gemini API calls.',
    readmeExcerpt:
      'Striveda helps users balance time, money, and goals with smart tracking, habits, and guidance for sustainable personal growth.',
    verificationStatus: 'verified-full-repo',
    imageKey: 'striveda',
    caseStudy: {
      overview:
        'Striveda is an AI-assisted full-stack personal growth, financial literacy, and productivity platform. Inspecting Roubat06/Striveda reveals a React 18 authentication and dashboard shell paired with eight specialized backend feature servers running on Express 5, Socket.IO, and PostgreSQL.',
      problem:
        'Personal finance tracking, daily task scheduling, and habit building are typically fragmented across separate utilities, while financial literacy concepts are rarely practiced through interactive, consequence-aware scenarios.',
      solution:
        'Unifies interactive financial simulation, budget tracking, AI task planning, collaborative group challenges, and curated productivity news into a single modular web application backed by PostgreSQL authentication and Google Gemini intelligence.',
      technicalImplementation: [
        'Dynamic Module Loader (backend/server.js): Safely mounts 8 feature modules (budget, game, group-d, money-feature, task-pl, time-money-news, writing, money-time-chatbot) into the Express 5 and Socket.IO server while exposing live diagnostics at /health and /api/modules/status.',
        'Scenario & Game Engine (backend/servers/game/gameLogic.js & geminiService.js): Computes daily budgets by player age (5–100) and profession multipliers, tracks used scenario categories across Morning/Afternoon/Evening/Night time blocks to prevent repetition, and synthesizes a 25-decision financial graduation report.',
        'Real-Time Group & Leaderboard Engine (backend/servers/group-d.js): Manages active groups, competition timers, leaderboard rankings, public chat, and peer-to-peer direct messages over Socket.IO.',
        'RSS Aggregation & AI Summarization (backend/servers/time-money-news.js): Uses rss-parser on an hourly check interval across 6 productivity/business feeds, summarizing articles via Gemini and persisting records to money_time_news_database.json.',
        'Resilient AI Wrapper (backend/servers/writing.js): Combines express-rate-limit (20 requests per 15-minute window) with a 3-attempt exponential backoff retry loop (callGeminiWithRetry) and deterministic fallback responses.',
        'PostgreSQL Auth & Account Recovery (backend/server.js & utils/mailer.js): Auto-migrates the PostgreSQL users table on startup (supporting both DATABASE_URL with SSL and discrete PG* env vars), hashes passwords with bcryptjs, issues 7-day JWTs, verifies Google OAuth credentials, and emails cryptographic password reset tokens via Nodemailer.',
      ],
      technologies: {
        frontend: ['React 18.3.1', 'React Router DOM 6.24.0', '@react-oauth/google 0.12.1', 'Axios 1.7.2', 'HTML5 / CSS3 / Vanilla JS Feature Workspaces'],
        backend: ['Node.js', 'Express 5.1.0', 'Socket.IO 4.8.1', 'express-rate-limit 7.4.0', 'rss-parser 3.13.0', 'Nodemailer 6.9.15'],
        database: ['PostgreSQL (pg 8.11.3)', 'JSON File Store (money_time_news_database.json)'],
        aiAndLibraries: ['@google/generative-ai 0.24.1 (Gemini 3.5 Flash Lite)', 'jsonwebtoken 9.0.2', 'bcryptjs 2.4.3', 'google-auth-library 10.9.1'],
      },
      challenges: [
        'Preventing single-module configuration errors or AI rate limits from taking down the entire multi-feature server—resolved by building a fault-isolated module loader and per-module fallback modes.',
        'Supporting both local PostgreSQL development and managed cloud PostgreSQL hosts (such as Render) seamlessly via dual connection-string / discrete parameter pool initialization and idempotent ALTER TABLE startup migrations.',
        'Ensuring AI-generated responses in the task planner and game engine conform to expected JSON structures by implementing markdown code-fence stripping and fallback scenario generators.',
      ],
      github: {
        repoName: 'Roubat06/Striveda',
        url: 'https://github.com/Roubat06/Striveda',
        branch: 'main',
        structureSummary: [
          'backend/server.js — Express 5 + Socket.IO entrypoint, PostgreSQL pool, JWT/Google OAuth endpoints, and module loader',
          'backend/servers/ — 8 modular feature backends (game.js, group-d.js, budget.js, money-feature.js, task-pl.js, time-money-news.js, writing.js, money-time-chatbot.js)',
          'backend/servers/game/ — gameLogic.js & geminiService.js for the 25-scenario financial simulation',
          'frontend/src/ — React 18 SPA with AuthContext, ProtectedRoute, Landing, Login, Register, ForgotPassword, ResetPassword, and Home dashboard',
          'frontend/public/legacy/ & backend/client/ — Interactive HTML/CSS/JS workspaces for each specialized module',
        ],
        verificationNote: 'Verified directly from GitHub repository Roubat06/Striveda (README.md, package.json, backend/server.js, backend/servers/*, and frontend/src/*).',
      },
    },
  },

  // 3. LIFECOACHX — THIRD PRIORITY MAIN PROJECT
  {
    id: 'lifecoachx',
    title: 'LifeCoachX',
    featured: true,
    priority: 3,
    status: 'completed',
    tier: 'primary-compact',
    category: 'Full-Stack AI Health, Fitness & Wellness Platform',
    tagline: 'Dual-backend full-stack wellness platform combining Node.js/Express/MySQL real-time chat with a Python/Flask Gemini AI coaching and audio synthesis engine.',
    summary:
      'A full-stack health and wellness coaching platform built with a two-service architecture: a Node.js + Express 5 + MySQL + Socket.IO service handling user authentication and real-time community/private chat, paired with a Python + Flask service powered by Google Gemini 2.0 Flash, NumPy, SoundFile, and Feedparser for personalized 7-day diet plans, food intake analysis, adaptive workouts, fitness risk scoring, synthetic WAV soundscapes, and health news summarization.',
    purpose:
      'Deliver personalized fitness, nutrition, mental wellness, and peer community support by uniting AI-driven diet/workout coaching and procedural audio soundscape generation with real-time user chat and authentication.',
    githubUrl: 'https://github.com/Roubat06/Life-Coach-X',
    repoFullName: 'Roubat06/Life-Coach-X',
    technologies: [
      'Python (Flask)',
      'Node.js (Express 5)',
      'MySQL (mysql / mysql2)',
      'Socket.IO',
      'Google Gemini API (google-generativeai)',
      'NumPy & SoundFile (WAV synthesis)',
      'Feedparser (RSS)',
      'EJS & HTML5/CSS3/JS',
      'bcrypt & express-session',
    ],
    frontendTech: [
      'HTML5, CSS3, and Vanilla JavaScript templates (dashboard.html, chatbot.html, diet.html, intake.html, workout.html, sound.html, user_data.html, news.html, main.html, chat-app.html)',
      'EJS Server-Side Templates (login.ejs, register.ejs)',
      'Socket.IO Client 4.8.1 (real-time public and 1-on-1 private chat UI)',
    ],
    backendTech: [
      'Service 1 (myform/server.js): Node.js, Express 5.1.0, Socket.IO 4.8.1, express-session 1.18.1, bcrypt 5.1.1, body-parser, cookie-parser',
      'Service 2 (flask/app.py): Python Flask, Flask-CORS, google-generativeai (Gemini 2.0 Flash), NumPy, SoundFile (sf), feedparser',
    ],
    databaseTech: [
      'MySQL relational database (myform/db.js — users table queried via mysql2/mysql for registration and session login)',
      'JSON file cache (flask/news_cache.json for RSS health news caching)',
      'In-memory audio buffer cache (audio_cache dictionary in flask/app.py serving generated 44.1kHz WAV files)',
    ],
    majorFeatures: [
      'Personalized 7-Day Diet Plan Generator (POST /generate_diet_plan): Computes BMI from user weight and height and prompts Gemini to generate a 7-day meal plan with daily calorie targets, macronutrient breakdowns, recipes, and hydration guidelines tailored to goals, allergies, and dietary restrictions.',
      'Nutritional Food Intake Analyzer (POST /analyze): Parses free-text meal descriptions via Gemini into structured JSON containing estimated calories, per-meal nutrients, potentially harmful ingredients, health verdicts, and actionable dietary improvements.',
      'Adaptive Workout & Voice Coach Engine (POST /generate_workout, POST /get_mood_advice, POST /get_exercise_instructions): Generates JSON exercise arrays (name, duration in seconds, form instructions, intensity 1–5) adapted to user mood, fitness level, workout type, and focus areas, with optional voice-coaching cues.',
      'Comprehensive Fitness Assessment (POST /api/analyze-fitness): Evaluates user assessment data to return BMI, overall fitness score (0–100), and health risk ratings across cardiovascular, musculoskeletal, metabolic, and stress categories.',
      'Procedural WAV Audio & Mood Soundscape Generator (POST /api/generate_music, GET /api/audio/<audio_id>): Synthesizes custom multi-layered waveforms in memory at 44,100 Hz using NumPy and SoundFile (supporting configurable mood, intensity, duration, tempo, reverb, frequency shift, and filter cutoff) alongside Gemini music therapy suggestions.',
      'Fitness RSS News Aggregator & Summarizer (GET /get-fitness-news, POST /generate-summary): Parses and caches fitness articles from NYT Health, Bodybuilding.com, Men’s Health, and Shape using feedparser, and summarizes blog URLs with Gemini.',
      'MySQL Authentication & Real-Time Chat (myform/server.js): Bcrypt-secured user registration and login backed by MySQL, plus Socket.IO public chat rooms and 1-on-1 private chat invitations and messaging.',
    ],
    architecture:
      'Polyglot two-service full-stack architecture (node server.js + python app.py, with deployment config in render.yaml). The Node.js/Express service manages MySQL user persistence, EJS authentication flows, and Socket.IO WebSocket chat, then redirects authenticated users to the Python/Flask wellness dashboard running on port 5000.',
    technicalApproach:
      'Separates stateful user authentication and real-time WebSocket messaging (Node.js + Express + Socket.IO + MySQL) from scientific computing, audio DSP waveform synthesis, and LLM prompt orchestration (Python + Flask + NumPy + SoundFile + Gemini 2.0 Flash).',
    readmeExcerpt:
      'if you want to run locally then run this in your terminal: node server.js | python app.py',
    verificationStatus: 'verified-full-repo',
    imageKey: 'lifecoachx',
    caseStudy: {
      overview:
        'LifeCoachX (Roubat06/Life-Coach-X) is a full-stack health, fitness, and wellness coaching platform. Inspection of the repository reveals a hybrid Node.js and Python architecture combining MySQL-backed authentication and real-time Socket.IO chat with a Flask AI backend that powers nutrition planning, workout generation, fitness risk analysis, and NumPy-based synthetic audio therapy.',
      problem:
        'Wellness applications often isolate static workout trackers from nutritional analysis, mental relaxation tools, and real-time peer accountability.',
      solution:
        'Integrates an AI health coach, 7-day diet generator, food intake analyzer, mood-adaptive workout planner, procedural WAV soundscape synthesizer, fitness news aggregator, and real-time community/private chat into one platform.',
      technicalImplementation: [
        'Node.js Auth & Chat Server (myform/server.js & myform/db.js): Connects to a MySQL users table, hashes passwords with bcrypt, renders login.ejs and register.ejs, and manages Socket.IO events for public broadcasts (chat message) and 1-on-1 private chat handshakes (private chat request, private chat accept, private message).',
        'Flask AI Coaching Service (flask/app.py): Dynamically resolves available Gemini models (prioritizing gemini-2.0-flash) and exposes specialized JSON APIs for /generate_diet_plan, /analyze, /generate_workout, /get_mood_advice, /get_exercise_instructions, and /api/analyze-fitness.',
        'Procedural Audio Waveform Synthesis (generate_synthetic_audio in flask/app.py): Uses NumPy arrays at a 44,100 Hz sample rate to synthesize custom rhythmic, melodic, and ambient audio waveforms with reverb, frequency shifting, and low-pass filter cutoff parameters, streaming them as WAV files via SoundFile (io.BytesIO) at /api/audio/<audio_id>.',
        'Cached RSS Health Feed Pipeline (/get-fitness-news): Aggregates articles from 5 health/fitness RSS feeds via feedparser, filters entries against 15 fitness keywords, and caches results in flask/news_cache.json.',
      ],
      technologies: {
        frontend: ['HTML5 / CSS3 / Vanilla JS (8 Flask templates + 2 Node static views)', 'EJS 3.1.10 (login.ejs, register.ejs)', 'Socket.IO Client 4.8.1'],
        backend: ['Python Flask + Flask-CORS', 'Node.js + Express 5.1.0', 'Socket.IO 4.8.1', 'express-session 1.18.1', 'bcrypt 5.1.1'],
        database: ['MySQL (mysql 2.18.1 & mysql2 3.14.1)', 'JSON Cache (news_cache.json)', 'In-Memory WAV Audio Store'],
        aiAndLibraries: ['google-generativeai (Gemini 2.0 Flash)', 'NumPy (audio synthesis)', 'SoundFile (WAV encoding)', 'feedparser (RSS parsing)'],
        devops: ['render.yaml service configuration'],
      },
      challenges: [
        'Coordinating a polyglot runtime where Node.js handles MySQL session authentication and WebSocket chat while Python Flask serves the AI coaching endpoints and NumPy audio synthesis.',
        'Generating playable therapeutic audio on the fly without external audio files by synthesizing 44.1kHz waveforms directly in memory with NumPy and streaming WAV buffers through Flask.',
        'Normalizing LLM outputs across workout, intake, and fitness-risk endpoints by stripping markdown code fences and implementing fallback JSON responses.',
      ],
      github: {
        repoName: 'Roubat06/Life-Coach-X',
        url: 'https://github.com/Roubat06/Life-Coach-X',
        branch: 'main',
        structureSummary: [
          'flask/app.py — 1,090-line Python Flask server implementing Gemini diet, intake, workout, fitness assessment, RSS news, and NumPy WAV audio synthesis endpoints',
          'flask/templates/ — 8 interactive HTML views (dashboard, chatbot, diet, intake, workout, sound, user_data, news)',
          'flask/static/ — Frontend scripts (chatbot.js, diet.js, js/script.js)',
          'myform/server.js & myform/db.js — Express 5 server, MySQL connection, bcrypt auth routes, and Socket.IO public/private chat engine',
          'myform/views/ & myform/public/ — EJS login/register templates and chat-app frontend',
        ],
        verificationNote: 'Verified directly from GitHub repository Roubat06/Life-Coach-X (README.md, flask/app.py, myform/package.json, myform/server.js).',
      },
    },
  },

  // 4. TAMPERLOCK — SECONDARY PROJECT (Priority 4)
  {
    id: 'tamperlock',
    title: 'TamperLock',
    featured: false,
    priority: 4,
    status: 'completed',
    tier: 'secondary',
    category: 'Computer Vision & OCR Document Forgery Detection',
    tagline: 'Detects image tampering and localized document text forgery using OpenCV contour differencing, Tesseract OCR, and NLTK token comparison.',
    summary:
      'A computer vision and document forensics web application built with Python, Flask, OpenCV, Tesseract OCR (pytesseract), NLTK, and Matplotlib. Provides two specialized detection pipelines: pixel-level grayscale difference and contour extraction for visual tampering/signature inspection, and OCR word-bounding-box token comparison that highlights forged or altered document words directly on the suspect image.',
    purpose:
      'Identify unauthorized visual modifications, signature discrepancies, and altered words between reference and suspect document images using automated image processing and OCR token analysis.',
    githubUrl: 'https://github.com/Roubat06/TAMPERLOCKED',
    repoFullName: 'Roubat06/TAMPERLOCKED',
    technologies: [
      'Python',
      'Flask & Flask-CORS',
      'OpenCV (cv2)',
      'Tesseract OCR (pytesseract)',
      'NLTK (word_tokenize)',
      'NumPy',
      'Matplotlib',
      'HTML5 / CSS3 / Bootstrap 5.3 / Vanilla JS',
    ],
    frontendTech: [
      'HTML5 & CSS3 (tamperlock.html, aegisdetecting.html, tetradetecting.html, safety.html)',
      'Bootstrap 5.3.0',
      'Vanilla JavaScript (tdetecting.js, aegis.js, aegisforgery.js, tetra.js with FileReader dual-image preview and Fetch Blob rendering)',
    ],
    backendTech: [
      'Python Flask & Flask-CORS (image.py on port 5000, text.py on port 5001)',
      'OpenCV (cv2.imdecode, cv2.cvtColor, cv2.resize, cv2.absdiff, cv2.threshold, cv2.findContours, cv2.rectangle)',
      'pytesseract (image_to_data with bounding box coordinates & image_to_string)',
      'NLTK (punkt tokenizer & word_tokenize)',
      'Matplotlib & io.BytesIO (rendering annotated RGB comparison images to PNG streams)',
    ],
    databaseTech: [
      'Stateless in-memory / temporary image buffer processing (io.BytesIO and static/temp1.png, static/temp2.png)',
    ],
    majorFeatures: [
      'Visual Tampering & Contour Difference Engine (image.py — POST /detect): Decodes uploaded image pairs into grayscale arrays via OpenCV and NumPy, normalizes dimensions with cv2.resize, computes pixel-wise absolute difference (cv2.absdiff), applies binary thresholding (threshold=30), and counts external contours (cv2.findContours) to report structural discrepancies.',
      'OCR Word-Level Forgery Localization (text.py — POST /detect-text): Extracts text and word bounding boxes from two document images using pytesseract.image_to_data, tokenizes lowercase text via NLTK word_tokenize, computes token set differences (set(tokens2) - set(tokens1)), and draws red bounding boxes (cv2.rectangle) around altered words on the suspect image.',
      'Annotated Image Streaming Response (text.py): Converts the OpenCV BGR output image with highlighted forgery bounding boxes to RGB, renders it via Matplotlib into an in-memory PNG buffer (io.BytesIO), and streams it back to the browser via Flask send_file.',
      'Dual-Upload Forensics Web UI (tamperlock.html, aegisdetecting.html, tetradetecting.html): Client-side FileReader image previews, dual-file validation gates, and dynamic rendering of annotated forgery comparison results.',
    ],
    architecture:
      'Client-server forensics architecture comprising static Bootstrap 5 / JavaScript inspection interfaces communicating via multipart FormData POST requests with two specialized Python Flask microservices: an OpenCV contour-differencing service (image.py) and a Tesseract OCR + NLTK token-level forgery localization service (text.py).',
    technicalApproach:
      'Combines classical computer vision (grayscale normalization, absolute pixel differencing, binary thresholding, and external contour extraction) with OCR spatial metadata (pytesseract.Output.DICT bounding boxes + NLTK set difference) to visually pinpoint tampered text regions.',
    readmeExcerpt:
      'TAMPERLOCKED — Document, signature, and image tampering detection using Python Flask, OpenCV, pytesseract OCR, and NLTK.',
    verificationStatus: 'verified-full-repo',
    imageKey: 'tamperlock',
    caseStudy: {
      overview:
        'TamperLock (Roubat06/TAMPERLOCKED) is a document and image tampering detection tool. Inspection of the repository shows two Python Flask computer vision backends (image.py and text.py) paired with multi-view HTML/Bootstrap/JavaScript interfaces (TamperLock, Aegis Detecting, and Tetra Detecting) for comparing reference and suspect images or documents.',
      problem:
        'Manual visual comparison of scanned documents, receipts, or signatures can easily miss subtle pixel alterations or single-word text substitutions.',
      solution:
        'Automates discrepancy detection through two complementary pipelines: pixel-level OpenCV contour differencing for general image/signature tampering, and Tesseract OCR + NLTK token differencing to draw bounding boxes directly around forged words in document scans.',
      technicalImplementation: [
        'Grayscale Absolute Difference & Contour Pipeline (image.py): Reads uploaded image bytes via np.frombuffer and cv2.imdecode(..., cv2.IMREAD_GRAYSCALE), resizes image2 to match image1 dimensions if needed, runs cv2.absdiff and cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY), and extracts external contours via cv2.findContours to return the total discrepancy count.',
        'OCR Bounding-Box Forgery Highlighter (text.py): Runs pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT) and NLTK word_tokenize on both images, calculates diff_tokens = set(tokens2) - set(tokens1), iterates over word coordinates (left, top, width, height), and draws 2px bounding rectangles with cv2.rectangle around every modified token.',
        'In-Memory Annotated Image Delivery (text.py): Renders the annotated image with Matplotlib into an io.BytesIO PNG buffer and returns it via Flask send_file, which the frontend (aegisforgery.js) converts into an object URL (URL.createObjectURL(blob)) for immediate side-by-side inspection.',
      ],
      technologies: {
        frontend: ['HTML5', 'CSS3', 'Bootstrap 5.3.0', 'Vanilla JavaScript (FileReader & Fetch Blob APIs)'],
        backend: ['Python', 'Flask', 'Flask-CORS'],
        aiAndLibraries: ['OpenCV (cv2)', 'Tesseract OCR (pytesseract)', 'NLTK (punkt, word_tokenize)', 'NumPy', 'Matplotlib'],
      },
      challenges: [
        'Handling mismatched dimensions between reference and suspect image uploads—solved by dynamically normalizing image2 dimensions to image1.shape using cv2.resize prior to pixel differencing.',
        'Mapping token-level text differences back to exact pixel coordinates on the suspect document—solved by pairing NLTK token set differencing with pytesseract.Output.DICT bounding box arrays.',
      ],
      github: {
        repoName: 'Roubat06/TAMPERLOCKED',
        url: 'https://github.com/Roubat06/TAMPERLOCKED',
        branch: 'main',
        structureSummary: [
          'image.py — Flask microservice (:5000/detect) for OpenCV grayscale absdiff, binary thresholding, and contour counting',
          'text.py — Flask microservice (:5001/detect-text) for pytesseract OCR bounding-box extraction, NLTK tokenization, and forged-word highlighting',
          'tamperlock.html, aegisdetecting.html, tetradetecting.html, safety.html — Web inspection interfaces',
          'tdetecting.js, aegisforgery.js, aegis.js, tetra.js — Client-side image preview and multipart FormData handlers',
        ],
        verificationNote: 'Verified directly from GitHub repository Roubat06/TAMPERLOCKED (image.py, text.py, tamperlock.html, aegisdetecting.html, and JS scripts).',
      },
    },
  },

  // 5. V0-COMMERCE-STUDENT-PLATFORM — SECONDARY PROJECT (Priority 5, NOT main project)
  {
    id: 'v0-commerce-student-platform',
    title: 'v0-commerce-student-platform',
    featured: false,
    priority: 5,
    status: 'completed',
    tier: 'secondary',
    category: 'Student Commerce Platform',
    tagline: 'Commerce platform project focused on student marketplace and campus exchange workflows.',
    summary:
      'Secondary student commerce platform project in Roubat Ghosh’s portfolio. In accordance with strict source-verification rules, only verified repository metadata is presented here because the corresponding public GitHub repository (Roubat06/commerce_guidelines) is currently initialized without public source commits, and no unverified features or metrics are inferred.',
    purpose:
      'Provide a dedicated commerce and marketplace platform tailored for student users. (Detailed internal feature specifications and runtime metrics are intentionally omitted until the source tree is published publicly.)',
    githubUrl: 'https://github.com/Roubat06/commerce_guidelines',
    repoFullName: 'Roubat06/commerce_guidelines',
    technologies: ['Web Application Architecture', 'v0 Component Scaffolding'],
    frontendTech: ['v0 UI Component Architecture (Source repository currently private / unpopulated on public GitHub)'],
    backendTech: ['Not publicly committed in inspected GitHub repository'],
    databaseTech: ['Not publicly committed in inspected GitHub repository'],
    majorFeatures: [
      'Student-focused commerce platform architecture (secondary project; detailed feature claims are withheld because public source files are not yet pushed to GitHub).',
      'Strict source-of-truth compliance: zero unverified technologies, user counts, or performance claims are fabricated for this entry.',
    ],
    architecture:
      'Repository inspection note: The public repository Roubat06/commerce_guidelines exists under the Roubat06 GitHub account as an initialized repository without public commits, and v0-commerce-student-platform is not publicly readable via unauthenticated GitHub API. Per portfolio integrity rules, architectural details are kept concise rather than guessed.',
    technicalApproach:
      'Maintains strict adherence to verifiable repository evidence: rather than inferring Next.js, Stripe, or database schemas from the "v0-commerce-student-platform" project identifier, this record documents only what is verifiable on GitHub.',
    readmeExcerpt:
      'Public repository initialized under Roubat06/commerce_guidelines; full v0-commerce-student-platform source tree is not yet published to a public branch.',
    verificationStatus: 'verified-partial-repo',
    imageKey: 'commerce',
    caseStudy: {
      overview:
        'v0-commerce-student-platform is a secondary project in Roubat Ghosh’s portfolio. Inspection of the Roubat06 GitHub profile found an initialized repository at Roubat06/commerce_guidelines and no publicly accessible tree under the exact name v0-commerce-student-platform. Following the portfolio’s strict anti-hallucination policy, this case study remains concise and reports only verified repository state.',
      problem:
        'Campus and student-oriented commerce requires streamlined listing, discovery, and transaction flows tailored to academic communities.',
      solution:
        'A student commerce platform project built using v0-assisted web interface workflows. Specific unverified sub-modules, payment integrations, or database schemas are intentionally omitted until public source code is available for inspection.',
      technicalImplementation: [
        'Repository Status Verification: Inspected GitHub user Roubat06 and collaborator accounts; confirmed Roubat06/commerce_guidelines is currently an empty initialized public repository.',
        'Zero-Assumption Documentation: No unverified frontend libraries, backend endpoints, or performance metrics have been added to this case study.',
      ],
      technologies: {
        frontend: ['v0 / Modern Web UI Scaffolding'],
      },
      github: {
        repoName: 'Roubat06/commerce_guidelines',
        url: 'https://github.com/Roubat06/commerce_guidelines',
        branch: 'main',
        structureSummary: [
          'Repository initialized on GitHub under Roubat06/commerce_guidelines (source files for v0-commerce-student-platform not yet publicly pushed).',
        ],
        verificationNote:
          'Verified via GitHub API and git ls-remote: public repository has no committed files yet. Description kept concise per strict non-fabrication guidelines.',
      },
    },
  },

  // ==================================================
  // FUTURE PROJECTS (Hidden by default: status: "coming-soon", featured: false)
  // ==================================================
  {
    id: 'ai-finance',
    title: 'AI Finance',
    featured: false,
    priority: 6,
    status: 'coming-soon',
    tier: 'future',
    category: 'Financial Intelligence (In Development)',
    tagline: 'Upcoming project currently in development. Hidden from the main portfolio until explicitly enabled.',
    summary: 'AI Finance is currently under active development and is stored with status: "coming-soon" and featured: false.',
    purpose: 'Upcoming financial intelligence system (currently in development).',
    githubUrl: null,
    repoFullName: null,
    technologies: [],
    frontendTech: [],
    backendTech: [],
    databaseTech: [],
    majorFeatures: [],
    architecture: 'In development — not presented as completed functionality.',
    technicalApproach: 'In development.',
    readmeExcerpt: '',
    verificationStatus: 'coming-soon',
    caseStudy: {
      overview: 'AI Finance is currently being developed and remains hidden from the main portfolio until explicitly enabled.',
    },
  },
  {
    id: 'entity-matching-record-linkage',
    title: 'Entity Matching / Record Linkage',
    featured: false,
    priority: 7,
    status: 'coming-soon',
    tier: 'future',
    category: 'Data Engineering & Record Linkage (In Development)',
    tagline: 'Upcoming project currently in development. Hidden from the main portfolio until explicitly enabled.',
    summary: 'Entity Matching / Record Linkage is currently under active development and is stored with status: "coming-soon" and featured: false.',
    purpose: 'Upcoming entity resolution and record linkage system (currently in development).',
    githubUrl: null,
    repoFullName: null,
    technologies: [],
    frontendTech: [],
    backendTech: [],
    databaseTech: [],
    majorFeatures: [],
    architecture: 'In development — not presented as completed functionality.',
    technicalApproach: 'In development.',
    readmeExcerpt: '',
    verificationStatus: 'coming-soon',
    caseStudy: {
      overview: 'Entity Matching / Record Linkage is currently being developed and remains hidden from the main portfolio until explicitly enabled.',
    },
  },
  {
    id: 'aquatrace',
    title: 'AquaTrace',
    featured: false,
    priority: 8,
    status: 'coming-soon',
    tier: 'future',
    category: 'Environmental & Water Systems (In Development)',
    tagline: 'Upcoming project currently in development. Hidden from the main portfolio until explicitly enabled.',
    summary: 'AquaTrace is currently under active development and is stored with status: "coming-soon" and featured: false.',
    purpose: 'Upcoming water tracing and monitoring project (currently in development).',
    githubUrl: null,
    repoFullName: null,
    technologies: [],
    frontendTech: [],
    backendTech: [],
    databaseTech: [],
    majorFeatures: [],
    architecture: 'In development — not presented as completed functionality.',
    technicalApproach: 'In development.',
    readmeExcerpt: '',
    verificationStatus: 'coming-soon',
    caseStudy: {
      overview: 'AquaTrace is currently being developed and remains hidden from the main portfolio until explicitly enabled.',
    },
  },
  {
    id: 'portfolio-management-system',
    title: 'Portfolio Management System',
    featured: false,
    priority: 9,
    status: 'coming-soon',
    tier: 'future',
    category: 'Portfolio & Asset Management (In Development)',
    tagline: 'Upcoming project currently in development. Hidden from the main portfolio until explicitly enabled.',
    summary: 'Portfolio Management System is currently under active development and is stored with status: "coming-soon" and featured: false.',
    purpose: 'Upcoming portfolio management system (currently in development).',
    githubUrl: null,
    repoFullName: null,
    technologies: [],
    frontendTech: [],
    backendTech: [],
    databaseTech: [],
    majorFeatures: [],
    architecture: 'In development — not presented as completed functionality.',
    technicalApproach: 'In development.',
    readmeExcerpt: '',
    verificationStatus: 'coming-soon',
    caseStudy: {
      overview: 'Portfolio Management System is currently being developed and remains hidden from the main portfolio until explicitly enabled.',
    },
  },
];

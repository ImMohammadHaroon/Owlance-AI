import type { ProjectCategory } from "@/lib/types";

export interface SeedProject {
  name: string;
  slug: string;
  github_url: string;
  live_url: string | null;
  purpose: string;
  features: string;
  tech_stack: string;
  status: string;
  category: ProjectCategory;
}

export const SEED_PROJECTS: SeedProject[] = [
  {
    name: "AGI-for-agriculture",
    slug: "agi-for-agriculture",
    github_url: "https://github.com/ImMohammadHaroon/AGI-for-agriculture",
    live_url: "https://agi-for-agriculture.vercel.app",
    purpose:
      "Agricultural assistant combining leaf-image disease analysis with soil nutrient analysis and crop recommendations.",
    features:
      "LeafScan accepts leaf photos and produces AI-generated diagnosis, causes, and treatment suggestions. SoilCrop reads Arduino NPK sensors through Web Serial and generates crop and fertilizer advice tailored to Pakistan.",
    tech_stack: "JavaScript, React 19, Vite, React Router, CSS, OpenAI API, Web Serial/Arduino",
    status: "Documented application with Vercel URL; API and sensor setup required.",
    category: "personal",
  },
  {
    name: "agile-flow",
    slug: "agile-flow",
    github_url: "https://github.com/ImMohammadHaroon/agile-flow",
    live_url: "https://agile-flow-mauve.vercel.app",
    purpose: "Full-stack task management and communication system for academic institutions.",
    features:
      "Role-based task assignment for HODs, professors, supporting staff, and students. Private/community messages, online status, task email notifications, and dashboard statistics.",
    tech_stack: "JavaScript, React, Vite, Tailwind CSS, Express.js, Supabase/PostgreSQL, JWT, Nodemailer",
    status: "README documents v1.0.0 and local setup; Vercel URL listed.",
    category: "personal",
  },
  {
    name: "basit-portfolio",
    slug: "basit-portfolio",
    github_url: "https://github.com/ImMohammadHaroon/basit-portfolio",
    live_url: "https://basit-portfolio-indol.vercel.app",
    purpose: "Professional portfolio for mobile app developer Basit Ali.",
    features:
      "Bio, skills, education, project gallery, and detailed project pages. Responsive layout, dark/light theme, Framer Motion animation, and validated contact form.",
    tech_stack: "JavaScript, React 18, Vite, Tailwind CSS, React Router, Framer Motion",
    status: "Portfolio source and Vercel URL present; contact delivery still needs backend/email.",
    category: "personal",
  },
  {
    name: "blog",
    slug: "blog",
    github_url: "https://github.com/ImMohammadHaroon/blog",
    live_url: null,
    purpose: "Full-stack blogging website with authenticated post management.",
    features:
      "Sign-up/login/logout with token-protected post creation, editing, deletion, and retrieval. Image uploads and post comment creation, retrieval, and deletion routes.",
    tech_stack: "JavaScript, React 17, Material UI, Axios, Express.js, MongoDB/Mongoose, JWT, Multer/GridFS",
    status: "Client and server implementations present.",
    category: "personal",
  },
  {
    name: "budget-tracker",
    slug: "budget-tracker",
    github_url: "https://github.com/ImMohammadHaroon/budget-tracker",
    live_url: "https://budget-tracker-mocha-seven.vercel.app",
    purpose: "BudgetFlow personal finance web app for tracking income, spending, and savings.",
    features:
      "Monthly balance dashboard with recent transactions and income/expense totals. Add, search, filter, and delete transactions; charts for savings and cash flow. Email/password authentication using Supabase.",
    tech_stack: "JavaScript, React 18, Vite, Tailwind CSS, Supabase/PostgreSQL, Framer Motion, Recharts",
    status: "Documented application with Vercel URL; Supabase configuration required.",
    category: "personal",
  },
  {
    name: "d247-cricket",
    slug: "d247-cricket",
    github_url: "https://github.com/ImMohammadHaroon/d247-cricket",
    live_url: "https://immohammadharoon.github.io/d247-cricket",
    purpose: "Static cricket and sports dashboard interface styled around a D247-style sports/odds layout.",
    features:
      "Sports category tabs, expandable navigation, and cricket fixture/odds-style rows. Account balance display and sports/casino navigation in static page content.",
    tech_stack: "HTML, CSS, JavaScript, Bootstrap, jQuery, Font Awesome",
    status: "Static frontend with GitHub Pages URL; fixtures are hard-coded.",
    category: "personal",
  },
  {
    name: "Devowl-FB-BOT",
    slug: "devowl-fb-bot",
    github_url: "https://github.com/ImMohammadHaroon/Devowl-FB-BOT",
    live_url: null,
    purpose: "Desktop application for automating Facebook Marketplace product listings.",
    features:
      "Listing management, posting status statistics, logs, and start/pause/resume/stop controls. License-key activation and machine locking; Electron packaging targets Windows.",
    tech_stack: "JavaScript, Electron, React, Vite, Puppeteer, CSV parsing",
    status: "Application source present; package.json has unresolved merge-conflict markers.",
    category: "personal",
  },
  {
    name: "devowll",
    slug: "devowll",
    github_url: "https://github.com/ImMohammadHaroon/devowll",
    live_url: "https://devowll-omega.vercel.app",
    purpose: "Ghulabdev website presenting remote internship programs and digital services.",
    features:
      "Program/service pages for web development, e-commerce, UI/UX design, and digital marketing, plus application and contact routes. Certificate verification interface currently checks mock certificate records.",
    tech_stack: "JavaScript, React 19, Vite, Tailwind CSS, React Router, Framer Motion, EmailJS, Convex, Resend",
    status: "Website source and Vercel URL present; certificate verification uses mock data.",
    category: "personal",
  },
  {
    name: "dr-iftikhar-portfolio",
    slug: "dr-iftikhar-portfolio",
    github_url: "https://github.com/ImMohammadHaroon/dr-iftikhar-portfolio",
    live_url: "https://dr-iftikhar-portfolio.vercel.app",
    purpose:
      "Academic and research portfolio for Dr. Hafiz Iftikhar Hussain, a veterinary pathologist and molecular researcher.",
    features:
      "Research publications, background, professional timeline, conferences, and academic statistics. Responsive presentation, animated sections, and EmailJS contact form.",
    tech_stack: "JavaScript, React 19, Vite, Tailwind CSS, Framer Motion, EmailJS",
    status: "Documented academic portfolio with Vercel homepage.",
    category: "personal",
  },
  {
    name: "Foodly.",
    slug: "foodly",
    github_url: "https://github.com/ImMohammadHaroon/Foodly.",
    live_url: "https://foodly-wheat.vercel.app",
    purpose: "Restaurant-facing frontend for a homemade-food delivery platform in Pakistan.",
    features:
      "Home, About, Contact and How It Works pages explain restaurant onboarding and ordering. Login and signup interfaces; inspected login uses simulated submission.",
    tech_stack: "JavaScript, React 18, Vite, React Router, Tailwind CSS",
    status: "Frontend demo; inspected login is simulated.",
    category: "personal",
  },
  {
    name: "humanize-ai",
    slug: "humanize-ai",
    github_url: "https://github.com/ImMohammadHaroon/humanize-ai",
    live_url: "https://humanize-ai-pi.vercel.app",
    purpose: "Web app for analyzing text for AI-like patterns and rewriting it in a selected tone.",
    features:
      "Detection view shows overall and sentence-level scores. Humanizer provides professional, casual, academic and creative tones with intensity controls and streamed output. Authenticated dashboard and saved analysis history use Supabase.",
    tech_stack: "TypeScript, React, Vite, shadcn/ui, Tailwind CSS, Supabase, TanStack Query",
    status: "Application implementation with recorded Vercel deployment URL.",
    category: "personal",
  },
  {
    name: "InvoiceFlow",
    slug: "invoiceflow",
    github_url: "https://github.com/ImMohammadHaroon/InvoiceFlow",
    live_url: null,
    purpose: "Full-stack demonstration of a construction accounts-payable invoice review workflow.",
    features:
      "Invoice dashboard with status filters, summary cards and possible-duplicate indicators. Detail pages show line items and support review notes plus approve/reject confirmation. Next.js API routes validate requests and persist review changes in Supabase PostgreSQL.",
    tech_stack: "TypeScript, Next.js App Router, React, Tailwind CSS, Zod, Supabase PostgreSQL",
    status: "Demonstration workflow with seed data; auth, OCR and uploads outside documented scope.",
    category: "personal",
  },
  {
    name: "kind-red-of-Ireland",
    slug: "kind-red-of-ireland",
    github_url: "https://github.com/ImMohammadHaroon/kind-red-of-Ireland",
    live_url: "https://kind-red-of-ireland.vercel.app",
    purpose: "Next.js recreation of the Kindred of Ireland linen-clothing storefront.",
    features:
      "Homepage assembles product, craftsmanship, menswear, bridal, news and Instagram sections. Includes product, collection, search, cart and checkout routes.",
    tech_stack: "Next.js, React, JavaScript/TypeScript, CSS, Tailwind CSS",
    status: "Storefront recreation with cart and checkout routes; deployment URL recorded.",
    category: "personal",
  },
  {
    name: "MedMatch-ai",
    slug: "medmatch-ai",
    github_url: "https://github.com/ImMohammadHaroon/MedMatch-ai",
    live_url: null,
    purpose:
      "Educational heart-disease risk assessment demo combining a machine-learning classifier with rule-based recommendations.",
    features:
      "React patient-input form calls a FastAPI prediction endpoint. Random Forest pipeline returns a risk probability and result view with urgency, doctor guidance and lifestyle tips.",
    tech_stack: "React, Vite, Tailwind CSS, Axios, Python, FastAPI, Pandas, scikit-learn, joblib",
    status: "Educational/demo project, not a medical device.",
    category: "personal",
  },
  {
    name: "meet-ai",
    slug: "meet-ai",
    github_url: "https://github.com/ImMohammadHaroon/meet-ai",
    live_url: "https://meet-ai-green.vercel.app",
    purpose: "Early Next.js dashboard scaffold for authenticated users and configurable AI-agent records.",
    features:
      "Better Auth setup supports authentication with GitHub/Google configuration. PostgreSQL schema stores named agents and instruction text. tRPC provides an agent-list query.",
    tech_stack: "TypeScript, Next.js 15, React 19, Tailwind CSS, Better Auth, tRPC, Drizzle ORM, Neon/PostgreSQL",
    status: "Early scaffold; home view is a placeholder.",
    category: "personal",
  },
  {
    name: "meeting-ai",
    slug: "meeting-ai",
    github_url: "https://github.com/ImMohammadHaroon/meeting-ai",
    live_url: "https://meetingai.dev",
    purpose: "Full-stack platform for live meetings, transcripts, generated notes and follow-up tasks.",
    features:
      "Real-time meetings with WebRTC and Socket.io. Generates English transcripts, meeting notes, action items and transcript-based Q&A. Organization management via Supabase authentication and PostgreSQL.",
    tech_stack: "React, Vite, Tailwind CSS, Node.js, Express, Supabase/PostgreSQL, Socket.io, WebRTC, OpenAI Whisper, GPT-4o mini",
    status: "Documented meeting application with live demo URL.",
    category: "personal",
  },
  {
    name: "Music-player",
    slug: "music-player",
    github_url: "https://github.com/ImMohammadHaroon/Music-player",
    live_url: "https://music-player-azure-tau.vercel.app",
    purpose: "Browser music player for locally selected audio files.",
    features:
      "Loads multiple audio files into a selectable playlist. Provides play/pause, previous/next track, progress seeking, and an animated vinyl-disc interface.",
    tech_stack: "HTML, CSS, vanilla JavaScript, browser Audio API",
    status: "Static application implementation with deployment URL.",
    category: "personal",
  },
  {
    name: "number-plate-recognation---extraction",
    slug: "number-plate-recognition",
    github_url: "https://github.com/ImMohammadHaroon/number-plate-recognation---extraction",
    live_url: null,
    purpose: "Computer vision notebook for locating a vehicle number plate and extracting its text from an image.",
    features:
      "Uses grayscale conversion, noise reduction, edge detection and contours to isolate the plate. Reads plate text with EasyOCR and draws annotated results.",
    tech_stack: "Python, Jupyter Notebook, OpenCV, EasyOCR, NumPy, Matplotlib, imutils",
    status: "Notebook prototype with local image input.",
    category: "personal",
  },
  {
    name: "portfolio",
    slug: "portfolio",
    github_url: "https://github.com/ImMohammadHaroon/portfolio",
    live_url: "https://www.haroon.live",
    purpose: "Mohammad Haroon's full-stack developer portfolio.",
    features:
      "Presents selected work, background, technology stack, publications and contact sections. Includes structured metadata, sitemap and robots routes, plus scroll-reveal components.",
    tech_stack: "Next.js, React, TypeScript, CSS, Nodemailer",
    status: "Portfolio implementation with configured public homepage.",
    category: "personal",
  },
  {
    name: "Portfollio",
    slug: "portfollio",
    github_url: "https://github.com/ImMohammadHaroon/Portfollio",
    live_url: "https://devowl.me",
    purpose: "React portfolio showcasing full-stack development and AI projects.",
    features:
      "Project case studies, category filters, contact form, and dark/light themes. Lazy-loaded routes, motion effects, per-page SEO and Vercel analytics.",
    tech_stack: "React, Vite, Tailwind CSS, React Router, Framer Motion, Web3Forms",
    status: "README documents Vercel deployment at devowl.me.",
    category: "personal",
  },
  {
    name: "qr-genie",
    slug: "qr-genie",
    github_url: "https://github.com/ImMohammadHaroon/qr-genie",
    live_url: "https://devowl-qr.vercel.app",
    purpose: "Web application for generating QR codes.",
    features:
      "React QR generator interface with reusable tabs and UI components. Includes optional Supabase integration and database migrations.",
    tech_stack: "React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase",
    status: "Application source and setup instructions present; Vercel homepage configured.",
    category: "personal",
  },
  {
    name: "react-dashboard",
    slug: "react-dashboard",
    github_url: "https://github.com/ImMohammadHaroon/react-dashboard",
    live_url: null,
    purpose: "Administration dashboard interface for sales and business metrics.",
    features:
      "Displays sales, revenue and expense charts with example data. Includes navigation for orders, customers, products and analytics.",
    tech_stack: "React, Create React App, Material UI, ApexCharts, Framer Motion",
    status: "Frontend dashboard demo using hard-coded sample data.",
    category: "personal",
  },
  {
    name: "speak-translate",
    slug: "speak-translate",
    github_url: "https://github.com/ImMohammadHaroon/speak-translate",
    live_url: "https://speak-translate.vercel.app",
    purpose: "Devowl Transcriptor converts uploaded audio into a transcript and English translation.",
    features:
      "Audio upload, transcription and translation through Supabase Edge Functions and an AI gateway. Email OTP authentication and per-user history stored in Postgres.",
    tech_stack: "React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase/Postgres, Lovable AI Gateway, Resend",
    status: "README documents application workflow; Vercel homepage configured.",
    category: "personal",
  },
  {
    name: "sphere",
    slug: "sphere",
    github_url: "https://github.com/ImMohammadHaroon/sphere",
    live_url: "https://ml-sphere.vercel.app",
    purpose: "ProjectSphere is a multi-tenant project management application for organizations and clients.",
    features:
      "Custom Kanban boards, tasks, milestones, comments, attachments and role-based dashboards. Reporting, notifications, client portal and subscription billing configuration.",
    tech_stack: "React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Socket.io, JWT, Stripe",
    status: "README documents Vercel deployment; Socket.io disabled there by default.",
    category: "personal",
  },
  {
    name: "to-do-app",
    slug: "to-do-app",
    github_url: "https://github.com/ImMohammadHaroon/to-do-app",
    live_url: "https://to-do-app-beryl-nu.vercel.app",
    purpose: "Task manager with individual user accounts and cloud storage.",
    features:
      "Email/password sign-in through Firebase Authentication. Users can add, view and delete their own tasks in Firestore.",
    tech_stack: "React, Vite, Firebase Authentication, Firestore, React Router, Tailwind CSS",
    status: "Application source and setup instructions present; Vercel homepage configured.",
    category: "personal",
  },
  {
    name: "unbound",
    slug: "unbound",
    github_url: "https://github.com/ImMohammadHaroon/unbound",
    live_url: "https://unbound-amber-five.vercel.app",
    purpose: "Marketing website for UnBound X, a social investing and smart-finance product.",
    features:
      "Sections for users, creators, tools, security, team, careers and contact. Animated sticky sections, scroll effects and a Join Now interface.",
    tech_stack: "Next.js, React, TypeScript, Tailwind CSS, GSAP, Swiper",
    status: "Frontend marketing site; not a working investment platform.",
    category: "personal",
  },
  {
    name: "BlueLine",
    slug: "blueline",
    github_url: "https://github.com/Umair-Siddique/BlueLine",
    live_url: "https://blue-line-red.vercel.app",
    purpose: "Authenticated chat frontend in a shared repository.",
    features:
      "Sign-up/sign-in screens with protected and public routes. Creates, selects and deletes conversations; stores recent chat history in localStorage.",
    tech_stack: "React, JavaScript, Vite, React Router, Tailwind CSS, Axios, React Markdown",
    status: "Shared frontend implementation with configured Vercel homepage.",
    category: "shared",
  },
  {
    name: "Mag-Rag",
    slug: "mag-rag",
    github_url: "https://github.com/Umair-Siddique/Mag-Rag",
    live_url: null,
    purpose: "Retrieval-augmented chat backend for a brand-strategy assistant.",
    features:
      "Uses vector retrieval, optional web search and conversation history to generate responses. Provides authentication, conversation management, document upload and custom system-prompt endpoints.",
    tech_stack: "Python, Flask, Supabase, Pinecone, OpenAI, LangChain, LangGraph, Tavily",
    status: "Shared backend implementation with Render configuration.",
    category: "shared",
  },
];

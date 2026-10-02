# Owlance AI

AI-powered Fiverr Business & Growth Assistant for Mohammad Haroon.

## What it includes

Five playbook-backed assistants with chats saved per module:

1. Client Reply Assistant
2. Message Rewriter
3. Client Requirement Analyzer
4. Fiverr Brief Analyzer / Proposal Writer
5. Fiverr Gig Creator & Analyzer

Plus **Project Memory**:
- Import the GitHub Project Catalog
- Add future projects anytime
- All assistants can reference verified projects (especially gig creation and proposals)

## Stack

- Next.js App Router
- Supabase Postgres
- OpenAI `gpt-5.6-sol`

## Setup

1. Copy `.env.example` to `.env.local` and fill in values:

```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5.6-sol
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Install and run:

```bash
npm install
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. Go to **Project Memory** and click **Import GitHub catalog** (or add projects manually).

## Security note

Never commit `.env.local`. If an API key was shared in chat, rotate it in the OpenAI dashboard.

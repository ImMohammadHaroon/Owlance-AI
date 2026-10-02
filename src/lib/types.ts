export type AssistantModule =
  | "client_reply"
  | "message_rewriter"
  | "requirement_analyzer"
  | "brief_analyzer"
  | "gig_creator";

export type MessageRole = "user" | "assistant" | "system";

export type ProjectCategory = "personal" | "learning" | "shared";

export interface Project {
  id: string;
  name: string;
  slug: string | null;
  github_url: string | null;
  live_url: string | null;
  purpose: string;
  features: string;
  tech_stack: string;
  status: string;
  category: ProjectCategory;
  is_verified: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  module: AssistantModule;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface ModuleMeta {
  id: AssistantModule;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  placeholder: string;
}

export const MODULES: ModuleMeta[] = [
  {
    id: "client_reply",
    slug: "client-reply",
    title: "Client Reply Assistant",
    shortTitle: "Client Reply",
    description:
      "Draft clear, professional Fiverr client replies in Haroon's voice.",
    placeholder:
      "Paste the client message and any context such as agreed scope, price, or deadline...",
  },
  {
    id: "message_rewriter",
    slug: "message-rewriter",
    title: "Message Rewriter",
    shortTitle: "Rewriter",
    description:
      "Improve grammar, clarity, and tone while preserving your original meaning.",
    placeholder: "Paste the message you want rewritten...",
  },
  {
    id: "requirement_analyzer",
    slug: "requirement-analyzer",
    title: "Client Requirement Analyzer",
    shortTitle: "Requirements",
    description:
      "Turn client messages and briefs into practical requirements and a realistic approach.",
    placeholder: "Paste the client brief, job post, or scope notes...",
  },
  {
    id: "brief_analyzer",
    slug: "brief-analyzer",
    title: "Fiverr Brief Analyzer / Proposal Writer",
    shortTitle: "Brief & Proposal",
    description:
      "Analyze freelance briefs and write tailored, ready-to-send proposals.",
    placeholder: "Paste the Fiverr brief or buyer request...",
  },
  {
    id: "gig_creator",
    slug: "gig-creator",
    title: "Fiverr Gig Creator & Analyzer",
    shortTitle: "Gig Creator",
    description:
      "Create, analyze, and improve Fiverr gigs with SEO-friendly titles, packages, and descriptions.",
    placeholder:
      "Describe the gig idea, niche, keywords, or paste an existing gig to analyze...",
  },
];

export function getModuleBySlug(slug: string): ModuleMeta | undefined {
  return MODULES.find((module) => module.slug === slug);
}

export function getModuleById(id: AssistantModule): ModuleMeta | undefined {
  return MODULES.find((module) => module.id === id);
}

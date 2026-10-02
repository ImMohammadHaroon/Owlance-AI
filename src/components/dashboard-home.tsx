"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { MODULES, type AssistantModule } from "@/lib/types";
import {
  BriefIcon,
  GigIcon,
  MemoryIcon,
  ReplyIcon,
  RequirementsIcon,
  RewriteIcon,
} from "@/components/sidebar-icons";

const icons: Record<AssistantModule, ComponentType<SVGProps<SVGSVGElement>>> = {
  client_reply: ReplyIcon,
  message_rewriter: RewriteIcon,
  requirement_analyzer: RequirementsIcon,
  brief_analyzer: BriefIcon,
  gig_creator: GigIcon,
};

const sections = [
  ...MODULES.map((module) => ({
    key: module.id,
    href: `/dashboard/${module.slug}`,
    title: module.shortTitle,
    description: module.description,
    eyebrow: "Assistant",
    Icon: icons[module.id],
  })),
  {
    key: "projects",
    href: "/dashboard/projects",
    title: "Project Memory",
    description: "Verified work the assistants can cite in replies and proposals.",
    eyebrow: "Memory",
    Icon: MemoryIcon,
  },
];

export function DashboardHome() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-1">
        <div className="mb-5 max-w-2xl shrink-0 sm:mb-6">
          <p className="text-[11px] font-medium tracking-[0.2em] text-copper uppercase">
            Studio
          </p>
          <h1
            className="mt-1.5 text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-ink sm:text-[2.1rem]"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Choose a workspace
          </h1>
          <div className="brand-underline mt-2.5 h-0.5 w-14 bg-copper" />
          <p className="mt-2 text-sm leading-5 text-muted">
            Open any assistant to chat with saved history, or manage the projects
            every module can remember.
          </p>
        </div>

        <div className="grid min-h-0 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          {sections.map((section) => {
            const Icon = section.Icon;
            return (
              <Link
                key={section.key}
                href={section.href}
                className="group flex min-h-0 flex-col rounded-2xl border border-line/80 bg-paper/90 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-copper/35 hover:bg-paper hover:shadow-[0_16px_40px_rgba(36,31,26,0.08)] sm:p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-desk/50 text-ink transition group-hover:border-copper/40 group-hover:bg-copper-soft group-hover:text-copper">
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 text-[11px] tracking-[0.16em] text-copper uppercase">
                  {section.eyebrow}
                </p>
                <h2
                  className="mt-0.5 text-base font-semibold tracking-tight text-ink sm:text-lg"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  {section.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted">
                  {section.description}
                </p>
                <span className="mt-3 text-xs font-medium tracking-wide text-accent-deep transition group-hover:text-copper">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

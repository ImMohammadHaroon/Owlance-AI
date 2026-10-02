"use client";

import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";

interface MessageBubbleProps {
  message: Message;
  index: number;
  isStreaming?: boolean;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1
      className="mb-2 mt-4 text-xl font-semibold tracking-tight first:mt-0"
      style={{ fontFamily: "var(--font-display), sans-serif" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="mb-2 mt-3.5 text-lg font-semibold tracking-tight first:mt-0"
      style={{ fontFamily: "var(--font-display), sans-serif" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="mb-1.5 mt-3 text-base font-semibold tracking-tight first:mt-0"
      style={{ fontFamily: "var(--font-display), sans-serif" }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-2.5 text-[15px] font-semibold first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-inherit">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-2.5 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2.5 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-6 [&>p]:mb-0">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-focus underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code className="block whitespace-pre-wrap font-mono text-[13px] leading-6">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[13px]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-2.5 overflow-x-auto rounded-lg border border-line/70 bg-desk/50 px-3 py-2.5 last:mb-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2.5 border-l-2 border-copper/50 pl-3 text-muted italic last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-line/80" />,
};

export function MessageBubble({
  message,
  index,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const showMeta = !isStreaming;

  return (
    <article
      className={cn(
        "group flex max-w-[min(100%,46rem)] gap-3",
        !isStreaming && "message-enter",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      )}
      style={
        isStreaming
          ? undefined
          : { animationDelay: `${Math.min(index, 8) * 40}ms` }
      }
    >
      <div
        className={cn(
          "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
          isUser
            ? "border-white/10 bg-sidebar text-sidebar-ink"
            : "border-accent/20 bg-accent-soft text-accent-deep",
        )}
      >
        {isUser ? (
          <UserRound className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div className={cn("min-w-0 flex-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-[14.5px] leading-7",
            isUser
              ? "rounded-tr-md bg-sidebar text-sidebar-ink shadow-[0_8px_24px_rgba(36,31,26,0.14)]"
              : "rounded-tl-md border border-line/90 bg-paper text-ink shadow-[0_6px_20px_rgba(36,31,26,0.05)]",
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          {isStreaming ? (
            <span
              className="stream-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] rounded-full bg-accent align-baseline"
              aria-hidden
            />
          ) : null}
        </div>

        {showMeta ? (
          <div
            className={cn(
              "mt-1.5 flex items-center gap-2",
              isUser ? "justify-end" : "justify-start",
            )}
          >
            <span className="text-[11px] text-muted">
              {isUser ? "You" : "Assistant"} ·{" "}
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <CopyButton text={message.content} plainText={!isUser} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

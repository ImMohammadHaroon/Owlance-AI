"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  LoaderCircle,
  MessageSquarePlus,
  SendHorizontal,
  Trash2,
  X,
} from "lucide-react";
import type { Conversation, Message, ModuleMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MessageBubble } from "@/components/message-bubble";

interface ChatWorkspaceProps {
  module: ModuleMeta;
}

const STREAMING_ID = "streaming-assistant";

export function ChatWorkspace({ module }: ChatWorkspaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const streamingRef = useRef<string | null>(null);
  streamingRef.current = streamingId;

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [conversations, activeId],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setLoadingChats(true);
      setError(null);
      try {
        const response = await fetch(`/api/conversations?module=${module.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load chats.");
        if (cancelled) return;
        setConversations(data.conversations ?? []);
        setActiveId((current) => current ?? data.conversations?.[0]?.id ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load chats.");
        }
      } finally {
        if (!cancelled) setLoadingChats(false);
      }
    }

    void loadConversations();
    return () => {
      cancelled = true;
    };
  }, [module.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      if (!activeId) {
        if (!streamingRef.current) setMessages([]);
        return;
      }

      // Keep the live streamed reply intact while tokens are arriving.
      if (streamingRef.current) return;

      setLoadingMessages(true);
      setError(null);
      try {
        const response = await fetch(`/api/messages?conversationId=${activeId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load messages.");
        if (!cancelled) setMessages(data.messages ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load messages.");
        }
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: streamingId ? "auto" : "smooth",
    });
  }, [messages, streamingId]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  async function refreshConversations() {
    const conversationsResponse = await fetch(
      `/api/conversations?module=${module.id}`,
    );
    const conversationsData = await conversationsResponse.json();
    if (conversationsResponse.ok) {
      setConversations(conversationsData.conversations ?? []);
    }
  }

  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);
    setInput("");

    const optimisticUser: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: activeId ?? "new",
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    const streamingMessage: Message = {
      id: STREAMING_ID,
      conversation_id: activeId ?? "new",
      role: "assistant",
      content: "",
      created_at: new Date().toISOString(),
    };

    setStreamingId(STREAMING_ID);
    setMessages((prev) => [...prev, optimisticUser, streamingMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: module.id,
          conversationId: activeId,
          message: content,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Chat request failed.");
      }

      if (!response.body) {
        throw new Error("Streaming is not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let conversationId = activeId;
      let sawDone = false;
      let pendingText = "";
      let rafId: number | null = null;

      const flushTokens = () => {
        if (!pendingText) return;
        const chunk = pendingText;
        pendingText = "";
        setMessages((prev) =>
          prev.map((item) =>
            item.id === STREAMING_ID
              ? { ...item, content: item.content + chunk }
              : item,
          ),
        );
      };

      const queueTokens = (text: string) => {
        pendingText += text;
        if (rafId != null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          flushTokens();
        });
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part
              .split("\n")
              .find((entry) => entry.startsWith("data: "));
            if (!line) continue;

            const payload = JSON.parse(line.slice(6)) as {
              type: "meta" | "token" | "done" | "error";
              conversationId?: string;
              text?: string;
              message?: Message;
              error?: string;
            };

            if (payload.type === "meta" && payload.conversationId) {
              conversationId = payload.conversationId;
              setActiveId(payload.conversationId);
              setMessages((prev) =>
                prev.map((item) =>
                  item.id === optimisticUser.id || item.id === STREAMING_ID
                    ? { ...item, conversation_id: payload.conversationId! }
                    : item,
                ),
              );
            }

            if (payload.type === "token" && payload.text) {
              queueTokens(payload.text);
            }

            if (payload.type === "error") {
              throw new Error(payload.error || "Chat request failed.");
            }

            if (payload.type === "done" && payload.message) {
              if (rafId != null) {
                window.cancelAnimationFrame(rafId);
                rafId = null;
              }
              flushTokens();
              sawDone = true;
              conversationId = payload.conversationId ?? conversationId;
              if (conversationId) setActiveId(conversationId);
              setMessages((prev) =>
                prev.map((item) =>
                  item.id === STREAMING_ID ? payload.message! : item,
                ),
              );
            }
          }
        }
      } finally {
        if (rafId != null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      }

      if (!sawDone) {
        throw new Error("Response ended before the answer finished.");
      }

      void refreshConversations();
    } catch (err) {
      setMessages((prev) =>
        prev.filter(
          (item) =>
            item.id !== optimisticUser.id && item.id !== STREAMING_ID,
        ),
      );
      setInput(content);
      setError(err instanceof Error ? err.message : "Chat request failed.");
    } finally {
      setStreamingId(null);
      setSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  async function handleDelete(conversationId: string) {
    const confirmed = window.confirm("Delete this chat and all its messages?");
    if (!confirmed) return;

    const response = await fetch(`/api/conversations?id=${conversationId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to delete chat.");
      return;
    }

    setConversations((prev) => prev.filter((item) => item.id !== conversationId));
    if (activeId === conversationId) {
      setActiveId(null);
      setMessages([]);
    }
  }

  function startNewChat() {
    setActiveId(null);
    setMessages([]);
    setError(null);
    setHistoryOpen(false);
    textareaRef.current?.focus();
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setHistoryOpen(false);
  }

  const chatRail = (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-sidebar text-sidebar-ink min-[900px]:w-[280px] min-[900px]:shrink-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(154,106,61,0.28),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-copper/50 via-white/10 to-transparent" />

      <div className="relative border-b border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs font-medium text-[#d5ccc1] transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All workspaces
          </Link>
          <button
            type="button"
            onClick={() => setHistoryOpen(false)}
            className="rounded-lg border border-white/15 bg-white/5 p-2 text-[#d5ccc1] min-[900px]:hidden"
            aria-label="Close chat history"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.16em] text-[#8f8478] uppercase">
              Saved chats
            </p>
            <p
              className="truncate text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              {module.shortTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={startNewChat}
            className="btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            New
          </button>
        </div>
      </div>

      <div className="relative flex-1 space-y-1 overflow-y-auto p-2">
        {loadingChats ? (
          <p className="px-2 py-4 text-sm text-[#9a9084]">Loading chats...</p>
        ) : conversations.length === 0 ? (
          <div className="mx-1 rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-3 py-5">
            <p className="text-sm font-medium text-white">No chats yet</p>
            <p className="mt-1 text-xs leading-5 text-[#9a9084]">
              Start a conversation and it will be saved in this module.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const active = conversation.id === activeId;
            return (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-start gap-2 rounded-xl px-3 py-3 transition",
                  active
                    ? "bg-white/10 ring-1 ring-copper/35"
                    : "hover:bg-white/5",
                )}
              >
                <button
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm font-medium text-[#f3eee6]">
                    {conversation.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#8f8478]">
                    {new Date(conversation.updated_at).toLocaleString()}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(conversation.id)}
                  className="rounded-md p-1.5 text-[#8f8478] opacity-0 transition group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-300"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="panel-shell flex h-full min-h-0 overflow-hidden rounded-none border-0 bg-paper">
      <aside className="hidden h-full min-[900px]:flex">{chatRail}</aside>

      {historyOpen ? (
        <div className="fixed inset-0 z-30 flex min-[900px]:hidden">
          <button
            type="button"
            aria-label="Close history overlay"
            className="absolute inset-0 bg-[#241f1a]/35"
            onClick={() => setHistoryOpen(false)}
          />
          <div className="relative z-10 h-full w-[min(100%,300px)] overflow-hidden shadow-xl">
            {chatRail}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col bg-paper">
        <div className="flex items-center justify-between gap-2 border-b border-line/80 px-3 py-2.5 min-[900px]:hidden">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium"
          >
            <History className="h-3.5 w-3.5" />
            Chats
          </button>
          <p className="truncate text-xs text-muted">
            {activeConversation?.title ?? "New chat"}
          </p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {loadingMessages ? (
            <p className="text-sm text-muted">Loading messages...</p>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                index={index}
                isStreaming={message.id === streamingId}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-line/80 p-2.5 sm:p-3">
          {error ? (
            <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="composer-glow rounded-xl border border-line bg-paper px-3 py-2 transition">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={module.placeholder}
              rows={2}
              className="max-h-[120px] min-h-[44px] w-full resize-none border-0 bg-transparent text-sm leading-5 text-ink outline-none placeholder:text-muted/80"
            />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted">
                Enter to send · Shift+Enter for new line · Hover to copy
              </p>
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
              >
                {sending ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-3.5 w-3.5" />
                )}
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

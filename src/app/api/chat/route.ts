import OpenAI from "openai";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/prompts";
import { createServiceClient } from "@/lib/supabase/server";
import { titleFromMessage } from "@/lib/utils";
import type { AssistantModule, Project } from "@/lib/types";
import { MODULES } from "@/lib/types";

export const runtime = "nodejs";

const VALID_MODULES = new Set(MODULES.map((module) => module.id));

function encodeSse(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const module = body.module as AssistantModule;
    const message = String(body.message ?? "").trim();
    const conversationId = body.conversationId
      ? String(body.conversationId)
      : null;

    if (!VALID_MODULES.has(module)) {
      return NextResponse.json({ error: "Invalid module." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const supabase = createServiceClient();

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (projectsError) {
      return NextResponse.json({ error: projectsError.message }, { status: 500 });
    }

    let activeConversationId = conversationId;

    if (!activeConversationId) {
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
          module,
          title: titleFromMessage(message),
        })
        .select("*")
        .single();

      if (conversationError || !conversation) {
        return NextResponse.json(
          {
            error:
              conversationError?.message ?? "Could not create conversation.",
          },
          { status: 500 },
        );
      }

      activeConversationId = conversation.id;
    } else {
      const { data: existing, error: existingError } = await supabase
        .from("conversations")
        .select("id, module")
        .eq("id", activeConversationId)
        .single();

      if (existingError || !existing || existing.module !== module) {
        return NextResponse.json(
          { error: "Conversation not found for this module." },
          { status: 404 },
        );
      }
    }

    const { error: userMessageError } = await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      role: "user",
      content: message,
    });

    if (userMessageError) {
      return NextResponse.json(
        { error: userMessageError.message },
        { status: 500 },
      );
    }

    const { data: history, error: historyError } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", activeConversationId)
      .order("created_at", { ascending: true })
      .limit(40);

    if (historyError) {
      return NextResponse.json({ error: historyError.message }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const conversationIdForStream = activeConversationId;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let assistantContent = "";

        const send = (payload: unknown) => {
          controller.enqueue(encoder.encode(encodeSse(payload)));
        };

        try {
          send({ type: "meta", conversationId: conversationIdForStream });

          const completion = await openai.chat.completions.create({
            model,
            stream: true,
            messages: [
              {
                role: "system",
                content: buildSystemPrompt(
                  module,
                  (projects ?? []) as Project[],
                ),
              },
              ...(history ?? []).map((item) => ({
                role: item.role as "user" | "assistant" | "system",
                content: item.content,
              })),
            ],
          });

          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (!delta) continue;
            assistantContent += delta;
            send({ type: "token", text: delta });
          }

          const finalContent =
            assistantContent.trim() ||
            "I could not generate a response. Please try again.";

          const { data: assistantMessage, error: assistantError } =
            await supabase
              .from("messages")
              .insert({
                conversation_id: conversationIdForStream,
                role: "assistant",
                content: finalContent,
              })
              .select("*")
              .single();

          if (assistantError || !assistantMessage) {
            send({
              type: "error",
              error:
                assistantError?.message ?? "Could not save assistant message.",
            });
            controller.close();
            return;
          }

          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationIdForStream);

          send({
            type: "done",
            conversationId: conversationIdForStream,
            message: assistantMessage,
          });
          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unexpected server error.";
          send({ type: "error", error: errorMessage });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

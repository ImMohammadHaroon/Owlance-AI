import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { AssistantModule } from "@/lib/types";
import { MODULES } from "@/lib/types";

const VALID_MODULES = new Set(MODULES.map((module) => module.id));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get("module") as AssistantModule | null;

  if (!module || !VALID_MODULES.has(module)) {
    return NextResponse.json({ error: "Invalid module." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("module", module)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ conversations: data ?? [] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Conversation id is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("conversations").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

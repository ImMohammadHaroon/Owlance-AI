import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { SEED_PROJECTS } from "@/lib/seed-projects";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      slug: body.slug ? String(body.slug).trim() : null,
      github_url: body.github_url ? String(body.github_url).trim() : null,
      live_url: body.live_url ? String(body.live_url).trim() : null,
      purpose: String(body.purpose ?? "").trim(),
      features: String(body.features ?? "").trim(),
      tech_stack: String(body.tech_stack ?? "").trim(),
      status: String(body.status ?? "").trim(),
      category: body.category ?? "personal",
      is_verified: true,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function PUT() {
  const supabase = createServiceClient();
  const { data: existing, error: existingError } = await supabase
    .from("projects")
    .select("slug, name");

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const existingKeys = new Set(
    (existing ?? []).flatMap((project) =>
      [project.slug, project.name.toLowerCase()].filter(Boolean),
    ),
  );

  const missing = SEED_PROJECTS.filter((project) => {
    const slugKey = project.slug;
    const nameKey = project.name.toLowerCase();
    return !existingKeys.has(slugKey) && !existingKeys.has(nameKey);
  });

  if (missing.length === 0) {
    return NextResponse.json({
      seeded: false,
      message: "Catalog already imported.",
      count: existing?.length ?? 0,
    });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(missing)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    seeded: true,
    inserted: data?.length ?? 0,
    count: (existing?.length ?? 0) + (data?.length ?? 0),
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

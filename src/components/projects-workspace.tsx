"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, LoaderCircle, Plus, Trash2 } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/types";

const emptyForm = {
  name: "",
  purpose: "",
  features: "",
  tech_stack: "",
  status: "",
  github_url: "",
  live_url: "",
  category: "personal" as ProjectCategory,
};

export function ProjectsWorkspace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function loadProjects() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load projects.");
      setProjects(data.projects ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    try {
      const response = await fetch("/api/projects", { method: "PUT" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to seed projects.");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to seed projects.");
    } finally {
      setSeeding(false);
    }
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add project.");
      setForm(emptyForm);
      setShowForm(false);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Remove this project from assistant memory?");
    if (!confirmed) return;

    const response = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to delete project.");
      return;
    }
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }

  return (
    <div className="panel-shell flex h-full min-h-0 flex-col overflow-hidden rounded-none border-0 bg-paper">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line/80 px-4 py-5 sm:px-6">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs font-medium text-muted transition hover:bg-desk/50 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All workspaces
          </Link>
          <p className="text-[11px] tracking-[0.18em] text-copper uppercase">
            Memory
          </p>
          <h2
            className="mt-1 text-[1.55rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Project Memory
          </h2>
          <div className="brand-underline mt-3 h-0.5 w-12 bg-accent" />
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            All assistants can remember these verified projects. Gig creation and
            proposals will reference them when they fit the task.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleSeed()}
            disabled={seeding}
            className="btn-secondary rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Import GitHub catalog"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add project
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>
        ) : null}

        {showForm ? (
          <form
            onSubmit={handleCreate}
            className="grid gap-3 rounded-xl border border-line bg-desk/40 p-4 md:grid-cols-2"
          >
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Project name"
              className="field-craft rounded-lg px-3 py-2.5 text-sm"
              required
            />
            <select
              value={form.category}
              onChange={(event) =>
                setForm({
                  ...form,
                  category: event.target.value as ProjectCategory,
                })
              }
              className="field-craft rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="personal">Personal</option>
              <option value="learning">Learning</option>
              <option value="shared">Shared</option>
            </select>
            <input
              value={form.github_url}
              onChange={(event) =>
                setForm({ ...form, github_url: event.target.value })
              }
              placeholder="GitHub URL"
              className="field-craft rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              value={form.live_url}
              onChange={(event) =>
                setForm({ ...form, live_url: event.target.value })
              }
              placeholder="Live URL"
              className="field-craft rounded-lg px-3 py-2.5 text-sm"
            />
            <textarea
              value={form.purpose}
              onChange={(event) =>
                setForm({ ...form, purpose: event.target.value })
              }
              placeholder="Purpose"
              rows={3}
              className="field-craft rounded-lg px-3 py-2.5 text-sm md:col-span-2"
            />
            <textarea
              value={form.features}
              onChange={(event) =>
                setForm({ ...form, features: event.target.value })
              }
              placeholder="Features"
              rows={3}
              className="field-craft rounded-lg px-3 py-2.5 text-sm md:col-span-2"
            />
            <input
              value={form.tech_stack}
              onChange={(event) =>
                setForm({ ...form, tech_stack: event.target.value })
              }
              placeholder="Tech stack"
              className="field-craft rounded-lg px-3 py-2.5 text-sm md:col-span-2"
            />
            <input
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value })
              }
              placeholder="Status notes"
              className="field-craft rounded-lg px-3 py-2.5 text-sm md:col-span-2"
            />
            <div className="flex gap-2 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Save to memory
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <p className="text-sm text-muted">Loading project memory...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-desk/35 px-5 py-8">
            <p
              className="text-base font-semibold text-ink"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              No projects stored yet
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Import the GitHub Project Catalog or add projects manually. Once
              saved, every assistant module can use them.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group rounded-xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_14px_36px_rgba(36,31,26,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-copper uppercase">
                      {project.category}
                    </p>
                    <h3
                      className="mt-1 text-lg font-semibold tracking-tight text-ink"
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {project.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(project.id)}
                    className="rounded-md p-1.5 text-muted opacity-70 transition group-hover:opacity-100 hover:bg-red-50 hover:text-danger"
                    aria-label="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {project.purpose ? (
                  <p className="mt-3 text-sm leading-6 text-muted">{project.purpose}</p>
                ) : null}
                {project.tech_stack ? (
                  <p className="mt-3 text-xs font-medium tracking-[0.04em] text-accent-deep">
                    {project.tech_stack}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-focus transition hover:underline"
                    >
                      GitHub <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-focus transition hover:underline"
                    >
                      Live <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

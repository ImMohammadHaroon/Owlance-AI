import { notFound } from "next/navigation";
import { ChatWorkspace } from "@/components/chat-workspace";
import { getModuleBySlug } from "@/lib/types";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const moduleMeta = getModuleBySlug(slug);

  if (!moduleMeta) {
    notFound();
  }

  return <ChatWorkspace module={moduleMeta} />;
}

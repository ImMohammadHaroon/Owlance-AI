"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/dashboard";

  return (
    <div className="relative z-10 flex h-screen flex-col overflow-hidden">
      <main
        className={cn(
          "min-h-0 min-w-0 flex-1 overflow-hidden",
          isHome ? "p-3 sm:p-4 lg:p-6" : "p-0",
        )}
      >
        {children}
      </main>
    </div>
  );
}

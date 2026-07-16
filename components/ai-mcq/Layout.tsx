"use client";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({
  children,
}: LayoutProps) {
  return (
    <main className="min-h-screen bg-[#F8F4E8]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {children}
      </div>
    </main>
  );
}
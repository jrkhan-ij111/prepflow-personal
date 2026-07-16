"use client";

import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-amber-100 p-4">
            <BrainCircuit
              className="text-amber-600"
              size={34}
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-stone-800">
              AI MCQ Generator
            </h1>

            <p className="mt-1 text-stone-600">
              Generate smart MCQs from your study materials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-sm text-stone-500">
              Sources
            </p>

            <h2 className="text-2xl font-bold text-amber-700">
              0
            </h2>
          </div>

          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-sm text-stone-500">
              Topics
            </p>

            <h2 className="text-2xl font-bold text-amber-700">
              0
            </h2>
          </div>

          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-sm text-stone-500">
              MCQs
            </p>

            <h2 className="text-2xl font-bold text-amber-700">
              0
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
}
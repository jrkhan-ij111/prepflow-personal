"use client";

import { useState } from "react";
import Layout from "@/components/ai-mcq/Layout";
import Header from "@/components/ai-mcq/Header";
import AiCoachPanel from "@/components/ai-coach/panel";
import HistoryManager from "@/components/ai-mcq/HistoryManager";
import MasteryTracker from "@/components/ai-mcq/MasteryTracker";

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<"lesson" | "coach" | "progress">("coach");

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-800">
              Learn &amp; Practice
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              PDF based MCQ practice, AI chat, and progress tracking.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2">
            {(["lesson", "coach", "progress"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
              >
                {tab === "lesson" ? "📚 Lesson" : tab === "coach" ? "🤖 AI Coach" : "📊 Progress"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "lesson" && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center">
              <p className="text-amber-800 font-medium text-lg">Coming soon</p>
              <p className="text-sm text-amber-600 mt-1">Structured lessons will appear here.</p>
            </div>
          )}

          {activeTab === "coach" && <AiCoachPanel />}

          {activeTab === "progress" && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Practice History</h2>
                <HistoryManager />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-800 mb-4">Mastery Overview</h2>
                <MasteryTracker />
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
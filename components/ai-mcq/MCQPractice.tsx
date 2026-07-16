"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  MCQState,
  Question,
  Source,
} from "@/types/mcq";

import {
  loadProgress,
  loadSources,
  saveProgress,
  saveSources,
} from "@/lib/storage";

// এই কম্পোনেন্টগুলো আমরা পরের ধাপে তৈরি করব
import SourceModal from "./SourceModal";
import PracticePanel from "./PracticePanel";
import ProgressPanel from "./ProgressPanel";

const initialState: MCQState = {
  sources: [],
  activeSourceId: null,
  topics: [],
  activeTopic: null,
  records: [],
};

export default function MCQPractice() {
  const [state, setState] = useState<MCQState>(initialState);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "practice" | "progress"
  >("practice");

  const [showSourceModal, setShowSourceModal] =
    useState(false);

  const [question, setQuestion] =
    useState<Question | null>(null);

  const [questionLoading, setQuestionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [sessionCount, setSessionCount] =
    useState(0);

  const [recentAsked, setRecentAsked] = useState<
    string[]
  >([]);

  // -----------------------------
  // Load Local Storage
  // -----------------------------

  useEffect(() => {
    const sources = loadSources();

    const progress = loadProgress();

    setState({
      ...progress,
      sources,
      activeSourceId:
        progress.activeSourceId ??
        sources[0]?.id ??
        null,
    });

    setLoading(false);
  }, []);

  // -----------------------------
  // Save Local Storage
  // -----------------------------

  useEffect(() => {
    if (loading) return;

    saveSources(state.sources);

    saveProgress(state);
  }, [state, loading]);

  // -----------------------------
  // Active Source
  // -----------------------------

  const activeSource = useMemo(() => {
    return (
      state.sources.find(
        (item) => item.id === state.activeSourceId
      ) ?? null
    );
  }, [state]);

  // -----------------------------
  // Add Source
  // -----------------------------

  function addSource(source: Source) {
    setState((prev) => ({
      ...prev,
      sources: [...prev.sources, source],
      activeSourceId: source.id,
      activeTopic: null,
    }));

    setQuestion(null);
    setError("");
  }

  // -----------------------------
  // Select Topic
  // -----------------------------

  function selectTopic(topic: string) {
    setState((prev) => ({
      ...prev,
      activeTopic: topic,
    }));

    setQuestion(null);
    setError("");
    setRecentAsked([]);
  }

  // -----------------------------
  // Add Topic
  // -----------------------------

  function addTopic(topic: string) {
    setState((prev) => ({
      ...prev,

      topics: prev.topics.includes(topic)
        ? prev.topics
        : [...prev.topics, topic],

      activeTopic: topic,
    }));
  }

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-gray-500">
          Loading MCQ Module...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                📚 AI MCQ Practice
              </h1>

              <p className="mt-2 text-gray-500">
                {activeSource
                  ? activeSource.name
                  : "No Source Selected"}
              </p>

            </div>

            <button
              onClick={() =>
                setShowSourceModal(true)
              }
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              {activeSource
                ? "🔄 Change Source"
                : "➕ Add Source"}
            </button>

          </div>

        </div>

        {/* Tabs */}

        <div className="flex gap-3">

          <button
            onClick={() =>
              setActiveTab("practice")
            }
            className={`rounded-xl px-5 py-3 font-semibold ${
              activeTab === "practice"
                ? "bg-emerald-600 text-white"
                : "bg-white"
            }`}
          >
            Practice
          </button>

          <button
            onClick={() =>
              setActiveTab("progress")
            }
            className={`rounded-xl px-5 py-3 font-semibold ${
              activeTab === "progress"
                ? "bg-emerald-600 text-white"
                : "bg-white"
            }`}
          >
            Progress
          </button>

        </div>

        {activeTab === "practice" ? (
          <PracticePanel
            state={state}
            question={question}
            loading={questionLoading}
            error={error}
            sessionCount={sessionCount}
            onTopicChange={selectTopic}
            onAddTopic={addTopic}
            onGenerate={() => {}}
            onAnswer={() => {}}
          />
        ) : (
          <ProgressPanel
            state={state}
            onReset={() => {}}
          />
        )}

      </div>

      <SourceModal
        open={showSourceModal}
        onClose={() =>
          setShowSourceModal(false)
        }
        onSave={addSource}
      />
    </>
  );
}
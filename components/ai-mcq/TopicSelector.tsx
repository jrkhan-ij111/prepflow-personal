"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X, Sparkles, Target, BookOpen } from "lucide-react";

interface Props {
  topics?: string[];
  onTopicChange?: (topics: string[]) => void;
  onSettingsChange?: (settings: TopicSettings) => void;
}

export interface TopicSettings {
  topics: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
  examMode: "BCS" | "Bank" | "General";
}

const STORAGE_KEY = "prepflow_topic_settings";

const difficultyOptions = ["Easy", "Medium", "Hard"] as const;
const examOptions = ["BCS", "Bank", "General"] as const;

export default function TopicSelector({
  topics = [],
  onTopicChange,
  onSettingsChange,
}: Props) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState<TopicSettings["difficulty"]>("Medium");
  const [count, setCount] = useState(20);
  const [examMode, setExamMode] = useState<TopicSettings["examMode"]>("BCS");
  const [loaded, setLoaded] = useState(false);

  // Load saved settings
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as TopicSettings;

        if (Array.isArray(data.topics)) {
          setSelectedTopics(data.topics);
        }

        if (data.difficulty && difficultyOptions.includes(data.difficulty as any)) {
          setDifficulty(data.difficulty);
        }

        if (typeof data.count === "number") {
          setCount(data.count);
        }

        if (data.examMode && examOptions.includes(data.examMode as any)) {
          setExamMode(data.examMode);
        }
      }
    } catch {
      console.log("Failed loading settings");
    }

    setLoaded(true);
  }, []);

  // Save settings
  useEffect(() => {
    if (!loaded) return;

    const settings: TopicSettings = {
      topics: selectedTopics,
      difficulty,
      count,
      examMode,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    onTopicChange?.(selectedTopics);
    onSettingsChange?.(settings);
  }, [loaded, selectedTopics, difficulty, count, examMode, onTopicChange, onSettingsChange]);

  const allTopics = useMemo(() => {
    return Array.from(new Set([...topics, ...selectedTopics]));
  }, [topics, selectedTopics]);

  function toggleTopic(topic: string) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  }

  function addCustomTopic() {
    const value = customTopic.trim();
    if (!value) return;

    const exists = selectedTopics.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );
    if (exists) return;

    setSelectedTopics((prev) => [...prev, value]);
    setCustomTopic("");
  }

  function removeTopic(topic: string) {
    setSelectedTopics((prev) => prev.filter((item) => item !== topic));
  }

  return (
    <div className="space-y-6">
      {/* Topic Selection */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Sparkles size={24} className="text-amber-600" />
          <div>
            <h2 className="font-bold text-xl">Select Topic</h2>
            <p className="text-sm text-gray-500">Choose topics for AI MCQ generation</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {allTopics.length === 0 ? (
            <p className="text-sm text-gray-500">No topics available</p>
          ) : (
            allTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedTopics.includes(topic)
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-amber-200"
                }`}
              >
                {topic}
              </button>
            ))
          )}
        </div>

        <div className="flex gap-2 mt-5">
          <input
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustomTopic();
            }}
            placeholder="Add custom topic..."
            className="flex-1 rounded-xl border px-4 py-2 outline-none"
          />
          <button
            type="button"
            onClick={addCustomTopic}
            className="rounded-xl bg-amber-500 px-4 text-white"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Selected Topics */}
      <div className="rounded-3xl border border-amber-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={22} className="text-amber-600" />
          <h3 className="font-bold">Selected Topics</h3>
        </div>

        {selectedTopics.length === 0 ? (
          <p className="text-sm text-gray-500">No topic selected</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm"
              >
                {topic}
                <button type="button" onClick={() => removeTopic(topic)}>
                  <X size={15} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="rounded-3xl border border-amber-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={22} className="text-amber-600" />
          <h3 className="font-bold">MCQ Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-sm text-gray-500">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as TopicSettings["difficulty"])
              }
              className="mt-2 w-full rounded-xl border p-3"
            >
              {difficultyOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">MCQ Count</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border p-3"
            >
              {[10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num} MCQ
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Exam Mode</label>
            <select
              value={examMode}
              onChange={(e) =>
                setExamMode(e.target.value as TopicSettings["examMode"])
              }
              className="mt-2 w-full rounded-xl border p-3"
            >
              {examOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
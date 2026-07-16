"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import ChatAssistant from "./ChatAssistant";

type ChatMessage = { role: "user" | "assistant"; content: string };
type ParsedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
};
type McqRecord = { topic: string; correct: boolean; date: string };

function extractFirstQuestion(text: string): ParsedQuestion | null {
  const match = text.match(/<<<QUESTION>>>([\s\S]*?)<<<END>>>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
}

function loadRecords(): McqRecord[] {
  try {
    const raw = localStorage.getItem("mcqRecords");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMcqRecord(topic: string, correct: boolean) {
  try {
    const records = loadRecords();
    records.push({ topic, correct, date: new Date().toISOString().slice(0, 10) });
    localStorage.setItem("mcqRecords", JSON.stringify(records));
  } catch (error) {
    console.log("mcqRecords save error:", error);
  }
}

function formatDayLabel(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

type AiCoachPanelProps = {
  title?: string;
  subtitle?: string;
};

export default function AiCoachPanel({
  title = "AI Coach",
  subtitle = "PDF থেকে MCQ প্র্যাকটিস",
}: AiCoachPanelProps) {
  const [sourceText, setSourceText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [tab, setTab] = useState<"practice" | "ask" | "progress">("practice");
  const [topicInput, setTopicInput] = useState("");

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ParsedQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [sessionCount, setSessionCount] = useState(0);
  const [records, setRecords] = useState<McqRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("aiCoachSource");
    if (saved) {
      try {
        const { text, name } = JSON.parse(saved);
        setSourceText(text);
        setFileName(name);
      } catch {}
    }
    setRecords(loadRecords());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = useMemo(() => records.filter((r) => r.date === today).length, [records, today]);
  const totalCount = records.length;
  const accuracy = totalCount > 0 ? Math.round((records.filter((r) => r.correct).length / totalCount) * 100) : 0;

  const last7Days = useMemo(() => {
    const days: { label: string; date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = records.filter((r) => r.date === dateStr).length;
      days.push({ label: formatDayLabel(d), date: dateStr, count });
    }
    return days;
  }, [records]);
  const maxDayCount = Math.max(1, ...last7Days.map((d) => d.count));

  const topicStats = useMemo(() => {
    const map: Record<string, { total: number; correct: number }> = {};
    records.forEach((r) => {
      if (!map[r.topic]) map[r.topic] = { total: 0, correct: 0 };
      map[r.topic].total += 1;
      if (r.correct) map[r.topic].correct += 1;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [records]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/ai-coach/extract-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "আপলোড ব্যর্থ হয়েছে");
        return;
      }
      setSourceText(data.text);
      setFileName(data.fileName);
      localStorage.setItem("aiCoachSource", JSON.stringify({ text: data.text, name: data.fileName }));
      setHistory([]);
      setCurrentQuestion(null);
      setSelectedIndex(null);
      setSessionCount(0);
      setTopicInput("");
      setFetchError("");
    } catch {
      setUploadError("আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setUploading(false);
    }
  }

  async function fetchNextQuestion() {
    if (!sourceText || loadingQ) return;
    setLoadingQ(true);
    setFetchError("");
    setCurrentQuestion(null);
    setSelectedIndex(null);
    try {
      const hiddenPrompt = topicInput.trim()
        ? `"${topicInput.trim()}" টপিক থেকে ১টা নতুন প্রশ্ন দাও`
        : "সোর্স থেকে যেকোনো একটা নতুন প্রশ্ন দাও";
      const newHistory: ChatMessage[] = [...history, { role: "user", content: hiddenPrompt }];

      const res = await fetch("/api/ai-coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText, messages: newHistory, topic: topicInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchError("প্রশ্ন আনতে সমস্যা হয়েছে, আবার চেষ্টা করো।");
        return;
      }
      const parsed = extractFirstQuestion(data.reply);
      if (!parsed) {
        setFetchError("প্রশ্ন বুঝতে সমস্যা হয়েছে, আবার চেষ্টা করো।");
        return;
      }
      setHistory([...newHistory, { role: "assistant", content: data.reply }]);
      setCurrentQuestion(parsed);
    } catch {
      setFetchError("প্রশ্ন আনতে সমস্যা হয়েছে, আবার চেষ্টা করো।");
    } finally {
      setLoadingQ(false);
    }
  }

  function handleAnswer(oi: number) {
    if (selectedIndex !== null || !currentQuestion) return;
    setSelectedIndex(oi);
    const correct = oi === currentQuestion.correctIndex;
    saveMcqRecord(currentQuestion.topic, correct);
    setRecords(loadRecords());
    setSessionCount((c) => c + 1);
  }

  const isCorrectAnswer = selectedIndex !== null && currentQuestion && selectedIndex === currentQuestion.correctIndex;

  return (
    <section className="overflow-hidden rounded-2xl shadow-sm">
      {/* হেডার */}
      <div className="border-b bg-white px-5 py-4">
        <h2 className="text-2xl font-extrabold text-emerald-800">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="bg-[#FFF8E7] p-4">
        {!sourceText ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">
              একটা PDF আপলোড করো — কোচ সেই কনটেন্ট থেকে তোমার জন্য MCQ প্রশ্ন তৈরি করবে।
            </p>
            <input type="file" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
            {uploading && <p className="mt-3 text-sm text-gray-500">PDF প্রসেস হচ্ছে...</p>}
            {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {/* টপ বার */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm text-gray-500">📄 {fileName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* ট্যাব ন্যাভিগেশন */}
                <div className="flex rounded-xl bg-gray-100 p-1">
                  {(["practice", "ask", "progress"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold sm:px-4 sm:text-sm ${
                        tab === t ? "bg-white shadow-sm" : "text-gray-500"
                      }`}
                    >
                      {t === "practice" ? "প্র্যাকটিস" : t === "ask" ? "প্রশ্ন করুন" : "প্রগতি"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("aiCoachSource");
                    setSourceText("");
                    setFileName("");
                    setHistory([]);
                    setCurrentQuestion(null);
                    setSelectedIndex(null);
                    setSessionCount(0);
                    setTopicInput("");
                    setFetchError("");
                  }}
                  className="text-xs text-red-600 hover:underline sm:text-sm"
                >
                  অন্য সোর্স
                </button>
              </div>
            </div>

            {tab === "practice" && (
              <div className="mt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <input
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="টপিক লেখো (খালি রাখলে সব টপিক)"
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm sm:w-64"
                  />
                  <p className="text-sm text-gray-500">
                    আজ: {todayCount}টি | সেশন: {sessionCount}টি
                  </p>
                </div>

                <div className="mt-4">
                  {!currentQuestion && !loadingQ && !fetchError && (
                    <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                      "প্রশ্ন শুরু করো" চাপো শুরু করার জন্য
                    </div>
                  )}

                  {loadingQ && (
                    <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                      প্রশ্ন তৈরি হচ্ছে...
                    </div>
                  )}

                  {fetchError && <p className="mb-3 text-sm text-red-600">{fetchError}</p>}

                  {currentQuestion && !loadingQ && (
                    <div className="rounded-xl border border-emerald-200 p-4">
                      <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {currentQuestion.topic}
                      </span>
                      <p className="mt-3 text-lg font-bold text-gray-900">{currentQuestion.question}</p>
                      <div className="mt-4 space-y-2">
                        {currentQuestion.options.map((opt, oi) => {
                          const isAnswered = selectedIndex !== null;
                          const isCorrect = oi === currentQuestion.correctIndex;
                          const isSelected = oi === selectedIndex;
                          let style = "border-gray-200 hover:bg-emerald-50";
                          if (isAnswered && isCorrect) style = "border-green-500 bg-green-50";
                          else if (isAnswered && isSelected && !isCorrect) style = "border-red-500 bg-red-50";
                          return (
                            <button
                              key={oi}
                              disabled={isAnswered}
                              onClick={() => handleAnswer(oi)}
                              className={`block w-full rounded-lg border px-4 py-3 text-left ${style}`}
                            >
                              {["ক", "খ", "গ", "ঘ"][oi]}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {selectedIndex !== null && (
                        <>
                          <div
                            className={`mt-4 rounded-lg border p-3 text-sm ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-50 text-gray-700"
                                : "border-red-500 bg-red-50 text-gray-700"
                            }`}
                          >
                            <p className={`mb-1 font-bold ${isCorrectAnswer ? "text-green-700" : "text-red-700"}`}>
                              {isCorrectAnswer ? "✓ সঠিক হয়েছে" : "✗ ভুল হয়েছে — নিয়ম দেখুন"}
                            </p>
                            {currentQuestion.explanation}
                          </div>
                          <button
                            onClick={fetchNextQuestion}
                            disabled={loadingQ}
                            className="mt-3 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                          >
                            পরবর্তী প্রশ্ন →
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {!currentQuestion && !loadingQ && (
                  <button
                    onClick={fetchNextQuestion}
                    disabled={loadingQ}
                    className="mt-4 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    প্রশ্ন শুরু করো →
                  </button>
                )}
              </div>
            )}

            {tab === "ask" && (
              <div className="mt-4">
                <ChatAssistant sourceText={sourceText} />
              </div>
            )}

            {tab === "progress" && (
              <div className="mt-4 space-y-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-center sm:p-4">
                    <p className="text-lg font-extrabold text-gray-900 sm:text-2xl">{totalCount}</p>
                    <p className="text-[11px] text-gray-500 sm:text-xs">মোট প্রশ্ন</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-center sm:p-4">
                    <p className="text-lg font-extrabold text-gray-900 sm:text-2xl">{accuracy}%</p>
                    <p className="text-[11px] text-gray-500 sm:text-xs">নির্ভুলতা</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-center sm:p-4">
                    <p className="text-lg font-extrabold text-gray-900 sm:text-2xl">{todayCount}</p>
                    <p className="text-[11px] text-gray-500 sm:text-xs">আজকের প্রশ্ন</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-bold text-gray-800">গত ৭ দিনের অনুশীলন</h3>
                  <div className="overflow-x-auto rounded-xl bg-emerald-50 p-4">
                    <div className="flex min-w-[420px] items-end justify-between gap-2" style={{ height: 140 }}>
                      {last7Days.map((d) => (
                        <div key={d.date} className="flex flex-1 flex-col items-center justify-end gap-1">
                          <span className="text-xs font-semibold text-gray-600">{d.count > 0 ? d.count : ""}</span>
                          <div
                            className="w-full rounded-t bg-emerald-500"
                            style={{ height: `${Math.max(4, (d.count / maxDayCount) * 90)}px` }}
                          />
                          <span className="text-xs text-gray-500">{d.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-bold text-gray-800">টপিক অনুযায়ী পারফরম্যান্স</h3>
                  {topicStats.length === 0 && <p className="text-sm text-gray-500">এখনো কোনো ডেটা নেই।</p>}
                  <div className="space-y-3">
                    {topicStats.map(([topic, stat]) => {
                      const pct = Math.round((stat.correct / stat.total) * 100);
                      return (
                        <div key={topic} className="flex items-center gap-2 sm:gap-3">
                          <span className="w-20 shrink-0 truncate text-xs text-gray-700 sm:w-32 sm:text-sm">{topic}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-14 shrink-0 text-right text-xs text-gray-600 sm:w-16 sm:text-sm">
                            {pct}% ({stat.total})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
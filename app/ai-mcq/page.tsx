"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Layout from "@/components/ai-mcq/Layout";
import Header from "@/components/ai-mcq/Header";
import SourceManager from "@/components/ai-mcq/SourceManager";
import TopicSelector, { TopicSettings } from "@/components/ai-mcq/TopicSelector";
import MCQPanel, { MCQ } from "@/components/ai-mcq/MCQPanel";
import ProgressTracker, { ProgressData } from "@/components/ai-mcq/ProgressTracker";
import HistoryManager, { HistoryItem } from "@/components/ai-mcq/HistoryManager";
import MasteryTracker, { MasteryData } from "@/components/ai-mcq/MasteryTracker";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function generateId() {
  return crypto.randomUUID();
}

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function getQuestionMastery(
  questionText: string,
  existingHistory: HistoryItem[]
): { attemptCount: number; status: "new" | "learning" | "mastered" } {
  const attempts = existingHistory.filter((h) => h.question === questionText);
  const count = attempts.length;
  if (count === 0) return { attemptCount: 1, status: "new" };

  const correctCount = attempts.filter((h) => h.isCorrect).length;
  const allCorrect = correctCount === count;

  if (count >= 3 && allCorrect) {
    return { attemptCount: count + 1, status: "mastered" };
  }
  return { attemptCount: count + 1, status: "learning" };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function AImcqPage() {
  const [sourceText, setSourceText] = useState("");
  const [settings, setSettings] = useState<TopicSettings>({
    topics: [],
    difficulty: "Medium",
    count: 20,
    examMode: "BCS",
  });
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    { mcqId: string; selectedIndex: number; correct: boolean }[]
  >([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const sessionSavedRef = useRef(false);

  // Load existing history on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("prepflow_mcq_history");
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {}
  }, []);

  // Generate new MCQs
  const handleGenerate = async () => {
    if (!sourceText.trim() || settings.topics.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-mcq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: sourceText.trim(),
          topics: settings.topics,
          difficulty: settings.difficulty,
          count: settings.count,
          examMode: settings.examMode,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Generation failed");
      const data = await res.json();
      setMcqs(data.mcqs);
      setAnsweredQuestions([]);
      setCorrectAnswers(0);
      setWrongAnswers(0);
      sessionSavedRef.current = false;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle each answer from MCQPanel
  const handleAnswer = useCallback(
    (mcqId: string, selectedIndex: number, correct: boolean) => {
      setAnsweredQuestions((prev) => [...prev, { mcqId, selectedIndex, correct }]);
      setCorrectAnswers((prev) => prev + (correct ? 1 : 0));
      setWrongAnswers((prev) => prev + (correct ? 0 : 1));
    },
    []
  );

  // Save to history when all questions are answered
  useEffect(() => {
    if (
      mcqs.length > 0 &&
      answeredQuestions.length === mcqs.length &&
      !sessionSavedRef.current
    ) {
      sessionSavedRef.current = true;

      const now = new Date().toISOString();

      // Create new HistoryItems for each answered question, skipping any
      // answered question whose MCQ can no longer be found.
      const newHistoryItems: HistoryItem[] = answeredQuestions.reduce<HistoryItem[]>(
        (acc, a) => {
          const mcq = mcqs.find((m) => m.id === a.mcqId);
          if (!mcq) return acc;

          const { attemptCount, status } = getQuestionMastery(mcq.question, history);

          // The API always returns { correctIndex: number } but the TypeScript type
          // from MCQPanel may not include it yet. Cast to any to access it safely.
          const correctIndex: number = (mcq as any).correctIndex ?? 0;

          acc.push({
            id: generateId(),
            question: mcq.question,
            selectedAnswer: mcq.options[a.selectedIndex],
            correctAnswer: mcq.options[correctIndex],
            isCorrect: a.correct,
            attemptCount,
            status,
            practicedAt: now,
          });

          return acc;
        },
        []
      );

      const updatedHistory = [...history, ...newHistoryItems];
      setHistory(updatedHistory);
      try {
        localStorage.setItem("prepflow_mcq_history", JSON.stringify(updatedHistory));
      } catch {}
    }
  }, [answeredQuestions, mcqs, history]);

  // Compute overall mastery data from full history
  const masteryData = useMemo<MasteryData>(() => {
    const distinctQuestions = new Set(history.map((h) => h.question));
    const totalQuestions = distinctQuestions.size;
    let mastered = 0;
    let learning = 0;
    let weak = 0;

    distinctQuestions.forEach((q) => {
      const attempts = history.filter((h) => h.question === q);
      const correctCount = attempts.filter((a) => a.isCorrect).length;
      const totalAttempts = attempts.length;
      if (totalAttempts >= 3 && correctCount === totalAttempts) {
        mastered++;
      } else if (totalAttempts > 0) {
        learning++;
      } else {
        weak++;
      }
    });

    const totalAttemptsAll = history.length;
    const averageAttempts =
      totalQuestions > 0 ? totalAttemptsAll / totalQuestions : 0;

    return {
      totalQuestions,
      mastered,
      learning,
      weak,
      averageAttempts,
      revisionNeeded: weak,
    };
  }, [history]);

  // Compute session progress for ProgressTracker
  const progressData = useMemo<ProgressData>(() => {
    const todaySolved = history.filter((h) => isToday(h.practicedAt)).length;
    return {
      totalQuestions: mcqs.length,
      completedQuestions: answeredQuestions.length,
      correctAnswers,
      wrongAnswers,
      todaySolved,
      dailyTarget: settings.count,
      mastered: masteryData.mastered,
      learning: masteryData.learning,
      weak: masteryData.weak,
    };
  }, [mcqs, answeredQuestions, correctAnswers, wrongAnswers, history, settings.count, masteryData]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-800">
              AI MCQ Generator
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Create custom multiple‑choice questions by selecting topics and settings.
            </p>
          </div>

          <SourceManager onSourceChange={setSourceText} />

          <TopicSelector
            topics={[
              "বাংলা ব্যাকরণ",
              "বাংলা সাহিত্য",
              "English Grammar",
              "English Vocabulary",
              "Mathematics",
              "General Science",
              "Bangladesh Affairs",
              "International Affairs",
              "Computer",
              "ICT",
              "Mental Ability",
              "Constitution",
              "Geography",
              "History",
              "Economics",
              "Banking",
              "Accounting",
              "Finance",
              "Marketing",
              "Management",
            ]}
            onSettingsChange={setSettings}
          />

          <div className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={handleGenerate}
              disabled={
                isLoading || sourceText.trim() === "" || settings.topics.length === 0
              }
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-8 py-4 text-lg font-semibold shadow-lg transition"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>Generate {settings.count} MCQs</>
              )}
            </button>
            {error && (
              <p className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
                {error}
              </p>
            )}
          </div>

          {/* Show progress tracker only when a session is active or history exists */}
          {(mcqs.length > 0 || history.length > 0) && (
            <ProgressTracker data={progressData} />
          )}

          <MCQPanel mcqs={mcqs} isLoading={isLoading} onAnswer={handleAnswer} />

          {/* History and Mastery sections – always shown */}
          <section className="pt-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Practice History</h2>
              <p className="text-gray-500 mb-4">View all previous attempts.</p>
              <HistoryManager history={history} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Mastery Overview</h2>
              <p className="text-gray-500 mb-4">Track your learning progress.</p>
              <MasteryTracker data={masteryData} />
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
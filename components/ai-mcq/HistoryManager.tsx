"use client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface HistoryItem {
  id: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  attemptCount: number;
  status: "new" | "learning" | "mastered";
  practicedAt: string;
}

interface Props {
  history?: HistoryItem[];
}

/* ------------------------------------------------------------------ */
/*  Helper: format date                                                */
/* ------------------------------------------------------------------ */
function formatDate(iso: string): string {
  try {
    const date = new Date(iso);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons (to avoid external libraries)                     */
/* ------------------------------------------------------------------ */
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HistoryManager({ history = [] }: Props) {
  // Statistics
  const totalAttempted = history.length;
  const correctCount = history.filter((item) => item.isCorrect).length;
  const wrongCount = totalAttempted - correctCount;
  const repeatCount = history.reduce(
    (acc, item) => acc + Math.max(item.attemptCount - 1, 0),
    0
  );

  const statusBadge = (status: HistoryItem["status"]) => {
    const base = "px-2 py-0.5 text-xs font-medium rounded-full";
    if (status === "mastered") return `${base} bg-green-100 text-green-800`;
    if (status === "learning") return `${base} bg-yellow-100 text-yellow-800`;
    return `${base} bg-blue-100 text-blue-800`; // new
  };

  const statusLabel = (status: HistoryItem["status"]) => {
    if (status === "mastered") return "Mastered";
    if (status === "learning") return "Repeated";
    return "New";
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-800">{totalAttempted}</p>
          <p className="text-xs text-amber-600">Attempted</p>
        </div>
        <div className="bg-white border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{correctCount}</p>
          <p className="text-xs text-green-600">Correct</p>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{wrongCount}</p>
          <p className="text-xs text-red-500">Wrong</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{repeatCount}</p>
          <p className="text-xs text-amber-600">Repeats</p>
        </div>
      </div>

      {/* History list or empty state */}
      {history.length === 0 ? (
        <div className="border border-dashed border-amber-200 rounded-3xl bg-amber-50/50 py-12 text-center">
          <ClockIcon className="mx-auto h-10 w-10 text-amber-300 mb-3" />
          <p className="text-amber-800 font-medium">No practice history yet.</p>
          <p className="text-sm text-amber-600 mt-1">
            Complete an MCQ session to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm"
            >
              {/* Top row: date + status + result */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <span className="text-xs text-gray-400">
                  {formatDate(item.practicedAt)}
                </span>
                <div className="flex items-center gap-2">
                  <span className={statusBadge(item.status)}>
                    {statusLabel(item.status)}
                  </span>
                  {item.isCorrect ? (
                    <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                      <CheckIcon className="h-4 w-4" />
                      Correct
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-medium flex items-center gap-1">
                      <XMarkIcon className="h-4 w-4" />
                      Wrong
                    </span>
                  )}
                </div>
              </div>

              {/* Question */}
              <p className="text-sm font-semibold text-gray-800 mb-2 break-words">
                Q: {item.question}
              </p>

              {/* Answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Your answer:</span>{" "}
                  <span
                    className={
                      item.isCorrect
                        ? "text-green-700 font-medium"
                        : "text-red-700 font-medium"
                    }
                  >
                    {item.selectedAnswer}
                  </span>
                </div>
                {!item.isCorrect && (
                  <div>
                    <span className="text-gray-500">Correct answer:</span>{" "}
                    <span className="text-green-700 font-medium">
                      {item.correctAnswer}
                    </span>
                  </div>
                )}
              </div>

              {/* Attempt count */}
              <div className="mt-2 text-xs text-gray-400">
                Attempt #{item.attemptCount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
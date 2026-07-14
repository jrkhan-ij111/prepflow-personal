"use client";

import { useEffect, useState } from "react";

import { analyzePerformance } from "@/data/aiCoach";
import { getRecommendation } from "@/data/recommendation";

export default function AICoach() {
  const [report, setReport] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("mcqRecords");

    if (!data) return;

    const records = JSON.parse(data);

    setReport(analyzePerformance(records));
  }, []);

  if (report.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">🤖 AI Coach Report</h2>

        <p className="mt-4 text-gray-500">
          এখনো কোনো Quiz Data নেই।
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">
        🤖 AI Coach Report
      </h2>

      <div className="mt-6 space-y-6">
        {report.map((item: any) => {
          const recommendation =
            getRecommendation(item.accuracy);

          return (
            <div
              key={item.topic}
              className="rounded-xl border p-5"
            >
              <h3 className="text-xl font-bold">
                📘 {item.topic}
              </h3>

              <div className="mt-4 space-y-2">

                <p>
                  📝 Attempt: {item.attempt}
                </p>

                <p>
                  ✅ Correct: {item.correct}
                </p>

                <p>
                  🎯 Accuracy: {item.accuracy}%
                </p>

              </div>

              {/* Mastery */}

              <div className="mt-5 rounded-lg bg-gray-50 p-4">
                <p
                  className={`text-lg font-bold ${item.masteryColor}`}
                >
                  {item.masteryLevel}
                </p>

                <p className="mt-2 text-gray-600">
                  {item.masteryMessage}
                </p>
              </div>

              {/* Status */}

              <div className="mt-4">
                {item.status === "Weak" ? (
                  <p className="font-semibold text-red-600">
                    ⚠️ Weak Topic - Revision Needed
                  </p>
                ) : (
                  <p className="font-semibold text-green-600">
                    ✅ Good Progress
                  </p>
                )}
              </div>

              {/* AI Recommendation */}

              <div className="mt-5 rounded-lg bg-blue-50 p-4">

                <h4 className="font-bold">
                  🤖 AI Suggestion
                </h4>

                <p className="mt-3">
                  {recommendation.message}
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {recommendation.actions.map(
                    (action: string, index: number) => (
                      <li key={index}>
                        {action}
                      </li>
                    )
                  )}
                </ul>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
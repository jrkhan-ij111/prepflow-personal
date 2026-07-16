"use client";

import { useState } from "react";
import OptionButton from "./OptionButton";
import { MCQ } from "./MCQPanel";

interface Props {
  number: number;
  mcq: MCQ;
  onAnswer?: (
    mcqId: string,
    selectedIndex: number,
    correct: boolean
  ) => void;
}

export default function MCQCard({
  number,
  mcq,
  onAnswer,
}: Props) {
  const [selected, setSelected] =
    useState<number | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  function submitAnswer() {
    if (selected === null) return;

    setSubmitted(true);

    onAnswer?.(
      mcq.id ?? String(number),
      selected,
      selected === mcq.answer
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
          Q{number}
        </span>

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm">
          {mcq.topic}
        </span>

      </div>

      <h2 className="mb-6 text-lg font-semibold">
        {mcq.question}
      </h2>

      <div className="space-y-3">

        {mcq.options.map((option, index) => (
          <OptionButton
            key={index}
            index={index}
            text={option}
            selected={selected}
            correctAnswer={mcq.answer}
            showAnswer={submitted}
            onSelect={setSelected}
          />
        ))}

      </div>

      {!submitted && (
        <button
          onClick={submitAnswer}
          className="mt-6 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <div
          className={`mt-6 rounded-xl p-4 ${
            selected === mcq.answer
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          <h3 className="font-bold">

            {selected === mcq.answer
              ? "✅ Correct"
              : "❌ Incorrect"}

          </h3>

          <p className="mt-2">
            {mcq.explanation}
          </p>

        </div>
      )}
    </div>
  );
}
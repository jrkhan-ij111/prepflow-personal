"use client";

import { useState } from "react";

import { mcqs } from "@/data/mcq";
import { saveQuizResult } from "@/data/saveQuiz";
import { saveWrongMCQ } from "@/data/wrongMCQ";

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = mcqs[current];

  function handleSubmit() {
    if (!selectedOption || submitted) return;

    setSubmitted(true);

    const correct = selectedOption === question.answer;
    if (correct) setScore((s) => s + 1);

    saveQuizResult({
      id: Date.now(),
      topic: question.topic,
      question: question.question,
      correct,
      selectedAnswer: selectedOption,
      correctAnswer: question.answer,
      date: new Date().toISOString(),
    });

    if (!correct) {
      saveWrongMCQ({
        id: Date.now(),
        topic: question.topic,
        question: question.question,
        selectedAnswer: selectedOption,
        correctAnswer: question.answer,
        date: new Date().toISOString(),
      });
    }
  }

  function nextQuestion() {
    setSelectedOption("");
    setSubmitted(false);

    if (current < mcqs.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">🎉 Quiz Complete</h2>
        <p className="mt-4 text-xl">Score: {score}/{mcqs.length}</p>
        <p className="mt-3">🤖 AI Coach এবং Revision Bank আপনার Result Save করেছে।</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">📝 Question {current + 1}</h2>
      <p className="mt-5 text-lg font-semibold">{question.question}</p>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === question.answer;

          let style = "hover:bg-emerald-50 border-gray-200";
          if (submitted && isCorrectOption) style = "bg-green-100 border-green-500";
          else if (submitted && isSelected && !isCorrectOption) style = "bg-red-100 border-red-500";
          else if (!submitted && isSelected) style = "bg-emerald-50 border-emerald-400";

          return (
            <label
              key={option}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left ${style}`}
            >
              <input
                type="radio"
                name={`question-${current}`}
                value={option}
                checked={isSelected}
                disabled={submitted}
                onChange={() => setSelectedOption(option)}
              />
              {option}
            </label>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="mt-6 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white disabled:opacity-40"
        >
          ✅ Submit
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          className="mt-6 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}
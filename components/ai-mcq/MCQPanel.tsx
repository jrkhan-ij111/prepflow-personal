"use client";

import MCQCard from "./MCQCard";

export interface MCQ {
  id?: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
}

interface Props {
  mcqs: MCQ[];
  isLoading?: boolean;
  onAnswer?: (
    mcqId: string,
    selectedIndex: number,
    correct: boolean
  ) => void;
}

export default function MCQPanel({
  mcqs,
  isLoading = false,
  onAnswer,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border p-10 text-center">
        Generating MCQs...
      </div>
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
        No MCQs Generated
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mcqs.map((mcq, index) => (
        <MCQCard
          key={mcq.id ?? index}
          number={index + 1}
          mcq={mcq}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
}
"use client";

interface OptionButtonProps {
  index: number;
  text: string;
  selected: number | null;
  correctAnswer: number;
  showAnswer: boolean;
  onSelect: (index: number) => void;
}

export default function OptionButton({
  index,
  text,
  selected,
  correctAnswer,
  showAnswer,
  onSelect,
}: OptionButtonProps) {
  const isSelected = selected === index;
  const isCorrect = correctAnswer === index;

  let className =
    "w-full rounded-xl border px-4 py-3 text-left transition font-medium ";

  if (!showAnswer) {
    className += isSelected
      ? "border-amber-500 bg-amber-100"
      : "border-stone-200 bg-white hover:bg-amber-50";
  } else {
    if (isCorrect) {
      className += "border-green-500 bg-green-100";
    } else if (isSelected) {
      className += "border-red-500 bg-red-100";
    } else {
      className += "border-stone-200 bg-white";
    }
  }

  return (
    <button
      disabled={showAnswer}
      onClick={() => onSelect(index)}
      className={className}
    >
      <span className="mr-2 font-bold">
        {String.fromCharCode(65 + index)}.
      </span>

      {text}
    </button>
  );
}
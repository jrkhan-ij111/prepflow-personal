"use client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface MasteryData {
  totalQuestions: number;
  mastered: number;
  learning: number;
  weak: number;
  averageAttempts: number;
  revisionNeeded: number;
}

interface Props {
  data?: Partial<MasteryData>;
}

/* ------------------------------------------------------------------ */
/*  Defaults                                                            */
/* ------------------------------------------------------------------ */
const DEFAULT_DATA: MasteryData = {
  totalQuestions: 0,
  mastered: 0,
  learning: 0,
  weak: 0,
  averageAttempts: 0,
  revisionNeeded: 0,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MasteryTracker({ data }: Props) {
  // Merge with defaults
  const {
    totalQuestions,
    mastered,
    learning,
    weak,
    averageAttempts,
    revisionNeeded,
  } = { ...DEFAULT_DATA, ...data };

  // Ensure totalQuestions consistency (it should equal the sum, but we'll trust the passed total)
  const sum = mastered + learning + weak;
  const effectiveTotal = totalQuestions > 0 ? totalQuestions : sum;
  const masteryPercent = effectiveTotal > 0
    ? Math.round((mastered / effectiveTotal) * 100)
    : 0;

  // Average attempts rounded to one decimal
  const avgAttempts = averageAttempts.toFixed(1);

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-800">{effectiveTotal}</p>
          <p className="text-xs text-amber-600">Total Tracked</p>
        </div>
        <div className="bg-white border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{mastered}</p>
          <p className="text-xs text-green-600">Mastered</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{learning}</p>
          <p className="text-xs text-blue-500">Learning</p>
        </div>
        <div className="bg-white border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{weak}</p>
          <p className="text-xs text-red-500">Weak</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{revisionNeeded}</p>
          <p className="text-xs text-amber-600">Need Revision</p>
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-white border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-amber-900">Mastery Progress</span>
          <span className="text-sm font-bold text-amber-700">{masteryPercent}%</span>
        </div>
        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>Mastered {masteryPercent}% of questions</span>
          <span>100%</span>
        </div>
      </div>

      {/* Additional Stats & Average Attempts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-amber-900 mb-1">Average Attempts</p>
          <p className="text-2xl font-bold text-amber-800">{avgAttempts}</p>
          <p className="text-xs text-amber-600">Per question</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-amber-900 mb-1">Revision Status</p>
          <p className="text-2xl font-bold text-amber-800">{revisionNeeded}</p>
          <p className="text-xs text-amber-600">Questions needing revision</p>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800 space-y-2">
        <p className="font-semibold text-amber-900">How Mastery is Calculated</p>
        <ul className="list-disc list-inside space-y-1 text-amber-700">
          <li>
            <span className="font-medium text-green-700">Mastered:</span> Answered correctly multiple times.
          </li>
          <li>
            <span className="font-medium text-blue-700">Learning:</span> Currently being practiced and improving.
          </li>
          <li>
            <span className="font-medium text-red-600">Weak:</span> Questions requiring more revision.
          </li>
          <li>
            <span className="font-medium text-amber-800">Revision Needed:</span> Questions that have not been attempted or performed poorly.
          </li>
        </ul>
      </div>
    </div>
  );
}
"use client";

import {
  CheckCircle,
  XCircle,
  BookOpen,
  Target,
  Brain,
  TrendingUp,
  Clock,
  BarChart3,
} from "lucide-react";

// ---------- Types ----------
export interface ProgressData {
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  todaySolved: number;
  dailyTarget: number;
  mastered: number;
  learning: number;
  weak: number;
}

interface Props {
  data?: Partial<ProgressData>;
}

// ---------- Defaults ----------
const DEFAULT_DATA: ProgressData = {
  totalQuestions: 0,
  completedQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  todaySolved: 0,
  dailyTarget: 1, // avoid division by zero
  mastered: 0,
  learning: 0,
  weak: 0,
};

export default function ProgressTracker({ data }: Props) {
  // Merge with safe defaults
  const {
    totalQuestions,
    completedQuestions,
    correctAnswers,
    wrongAnswers,
    todaySolved,
    dailyTarget,
    mastered,
    learning,
    weak,
  } = { ...DEFAULT_DATA, ...data };

  // Derived stats
  const remaining = Math.max(totalQuestions - completedQuestions, 0);
  const answered = correctAnswers + wrongAnswers;
  const accuracy = answered > 0 ? Math.round((correctAnswers / answered) * 100) : 0;
  const overallProgress =
    totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  const targetCompletion = dailyTarget > 0 ? Math.min(Math.round((todaySolved / dailyTarget) * 100), 100) : 0;

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <BarChart3 size={22} className="text-amber-600" />
        <h3 className="text-xl font-bold text-amber-800">MCQ Progress</h3>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Overall Progress</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-800">{completedQuestions}</p>
              <p className="text-xs text-amber-600">of {totalQuestions} MCQs</p>
            </div>
            <span className="text-sm font-medium text-amber-700">{overallProgress}%</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Performance</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle size={16} />
              <span className="font-bold">{correctAnswers}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <XCircle size={16} />
              <span className="font-bold">{wrongAnswers}</span>
            </div>
            <span className="text-sm font-medium text-amber-700 ml-auto">{accuracy}%</span>
          </div>
          <p className="mt-2 text-xs text-amber-600">
            Remaining: <span className="font-medium">{remaining}</span> MCQs
          </p>
        </div>

        {/* Study Progress – Today */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Today&apos;s Study</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-800">{todaySolved}</p>
              <p className="text-xs text-amber-600">target: {dailyTarget}</p>
            </div>
            <span className="text-sm font-medium text-amber-700">{targetCompletion}%</span>
          </div>
          {/* Target bar */}
          <div className="mt-3 w-full h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${targetCompletion}%` }}
            />
          </div>
        </div>

        {/* Mastery */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={20} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Mastery</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <p className="text-xs text-amber-600">Mastered</p>
              <p className="font-bold text-green-600">{mastered}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600">Learning</p>
              <p className="font-bold text-blue-600">{learning}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600">Weak</p>
              <p className="font-bold text-red-500">{weak}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-amber-600">
            Total assessed: <span className="font-medium">{mastered + learning + weak}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
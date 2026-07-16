"use client";

import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/ai-mcq/Layout";
import Header from "@/components/ai-mcq/Header";

type McqRecord = { topic: string; correct: boolean; date: string };

function loadRecords(): McqRecord[] {
  try {
    const raw = localStorage.getItem("mcqRecords");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function formatDayLabel(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export default function DashboardPage() {
  const [records, setRecords] = useState<McqRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = useMemo(() => records.filter((r) => r.date === today).length, [records, today]);
  const totalCount = records.length;
  const accuracy = totalCount > 0 ? Math.round((records.filter((r) => r.correct).length / totalCount) * 100) : 0;
  const correctCount = records.filter((r) => r.correct).length;
  const wrongCount = totalCount - correctCount;

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

  const todayTopics = useMemo(() => {
    const todayRecords = records.filter((r) => r.date === today);
    const map: Record<string, number> = {};
    todayRecords.forEach((r) => {
      map[r.topic] = (map[r.topic] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [records, today]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-800">
              ড্যাশবোর্ড
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              তোমার MCQ প্র্যাকটিসের সার্বিক অবস্থা
            </p>
          </div>

          {/* স্ট্যাট কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white border border-amber-200 p-4 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">{totalCount}</p>
              <p className="text-xs sm:text-sm text-gray-500">মোট প্রশ্ন</p>
            </div>
            <div className="rounded-2xl bg-white border border-green-200 p-4 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-green-600">{correctCount}</p>
              <p className="text-xs sm:text-sm text-gray-500">সঠিক</p>
            </div>
            <div className="rounded-2xl bg-white border border-red-200 p-4 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-red-500">{wrongCount}</p>
              <p className="text-xs sm:text-sm text-gray-500">ভুল</p>
            </div>
            <div className="rounded-2xl bg-white border border-amber-200 p-4 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">{accuracy}%</p>
              <p className="text-xs sm:text-sm text-gray-500">নির্ভুলতা</p>
            </div>
          </div>

          {/* আজকের কার্যকলাপ */}
          <div className="rounded-2xl bg-white border border-amber-200 p-5 shadow-sm">
            <h2 className="font-bold text-lg text-amber-800 mb-3">📅 আজকের অনুশীলন</h2>
            {todayCount === 0 ? (
              <p className="text-sm text-gray-500">আজ এখনো কোনো প্রশ্ন করা হয়নি।</p>
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-amber-700">{todayCount}টি প্রশ্ন</p>
                <div className="space-y-2">
                  {todayTopics.map(([topic, count]) => (
                    <div key={topic} className="flex justify-between text-sm">
                      <span className="text-gray-700">{topic}</span>
                      <span className="font-medium text-amber-700">{count}টি</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* গত ৭ দিনের চার্ট */}
          <div className="rounded-2xl bg-white border border-amber-200 p-5 shadow-sm">
            <h2 className="font-bold text-lg text-amber-800 mb-3">📊 গত ৭ দিন</h2>
            <div className="flex items-end justify-between gap-1 sm:gap-2 h-32">
              {last7Days.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1">
                  <span className="text-xs font-medium text-gray-600">{d.count || ""}</span>
                  <div
                    className="w-full rounded-t bg-amber-500"
                    style={{ height: `${Math.max(4, (d.count / maxDayCount) * 80)}px` }}
                  />
                  <span className="text-xs text-gray-500">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* টপিক পারফরম্যান্স */}
          <div className="rounded-2xl bg-white border border-amber-200 p-5 shadow-sm">
            <h2 className="font-bold text-lg text-amber-800 mb-3">📚 টপিক পারফরম্যান্স</h2>
            {topicStats.length === 0 ? (
              <p className="text-sm text-gray-500">এখনো কোনো ডেটা নেই।</p>
            ) : (
              <div className="space-y-3">
                {topicStats.map(([topic, stat]) => {
                  const pct = Math.round((stat.correct / stat.total) * 100);
                  return (
                    <div key={topic} className="flex items-center gap-2 sm:gap-3">
                      <span className="w-24 sm:w-32 shrink-0 truncate text-sm text-gray-700">{topic}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-16 shrink-0 text-right text-sm text-gray-600">
                        {pct}% ({stat.total})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}
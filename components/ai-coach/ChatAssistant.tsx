"use client";

export default function ChatAssistant({ sourceText }: { sourceText: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-800">
      <p className="text-lg font-semibold">এআই প্রশ্নোত্তর শীঘ্রই আসছে</p>
      <p className="text-sm mt-1 text-amber-600">আপনার PDF কন্টেন্ট সম্পর্কে প্রশ্ন করতে পারবেন।</p>
    </div>
  );
}
"use client";

import Link from "next/link";
import Quiz from "@/components/Quiz";
import LessonComplete from "@/components/LessonComplete";

export default function SamasLessonPage() {

  return (

    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">


      {/* Header */}

      <div className="mb-8">

        <p className="text-sm text-gray-500">
          Learn / বাংলা / ব্যাকরণ / সমাস
        </p>


        <h1 className="mt-2 text-4xl font-bold">
          📘 সমাস — Lesson 1
        </h1>


        <p className="mt-2 text-gray-600">
          AI Coach সহ শিখুন, অনুশীলন করুন এবং Master করুন।
        </p>

      </div>



      {/* Progress */}

      <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">


        <div className="flex justify-between">

          <span className="font-semibold">
            Lesson Progress
          </span>


          <span className="font-bold text-emerald-600">
            0%
          </span>

        </div>


        <div className="mt-3 h-3 rounded-full bg-gray-200">

          <div
            className="h-3 rounded-full bg-emerald-500"
            style={{ width: "0%" }}
          />

        </div>


      </section>




      {/* Concept */}

      <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold">
          📖 Concept
        </h2>


        <p className="mt-4 leading-8">

          সমাস হলো দুই বা ততোধিক পদের মিলনে
          একটি সংক্ষিপ্ত ও অর্থবহ পদ গঠনের প্রক্রিয়া।

        </p>


        <p className="mt-3 leading-8">

          সমাসের মাধ্যমে ভাষা সংক্ষিপ্ত,
          সুন্দর ও প্রাঞ্জল হয়।

        </p>


      </section>




      {/* Highlights */}

      <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold">
          ⭐ BCS Highlights
        </h2>


        <ul className="mt-4 list-disc space-y-2 pl-6">

          <li>সমাস শব্দের অর্থ — সংক্ষেপ।</li>

          <li>একাধিক পদ এক পদে পরিণত হয়।</li>

          <li>সমাসে পূর্বপদ ও পরপদ থাকে।</li>

          <li>BCS পরীক্ষায় গুরুত্বপূর্ণ অধ্যায়।</li>

        </ul>


      </section>




      {/* Example */}

      <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold">
          💡 Example
        </h2>


        <div className="mt-4 space-y-3">


          <p>
            রাজা + পুত্র = <strong>রাজপুত্র</strong>
          </p>


          <p>
            দেশ + প্রেম = <strong>দেশপ্রেম</strong>
          </p>


          <p>
            হাত + খরচ = <strong>হাতখরচ</strong>
          </p>


        </div>


      </section>




      {/* Trap */}

      <section className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6">


        <h2 className="text-2xl font-bold text-red-600">
          ⚠️ BCS Trap
        </h2>


        <p className="mt-4 leading-8">


          সন্ধি এবং সমাস এক নয়।


          <br /><br />


          ✅ সন্ধি → ধ্বনির পরিবর্তন


          <br />


          ✅ সমাস → পদের সংক্ষেপ


        </p>


      </section>




      {/* AI Coach */}

      <section className="mb-6 rounded-xl bg-emerald-50 p-6">


        <h2 className="text-2xl font-bold">
          🤖 AI Coach
        </h2>


        <p className="mt-3">

          সমাস বুঝতে সমস্যা হলে AI Coach
          আপনাকে সহজ ভাষায় ব্যাখ্যা করবে।

        </p>


        <button
          className="mt-4 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white"
        >

          Ask AI Coach

        </button>


      </section>




      {/* Quiz */}

      <section className="mb-6">


        <h2 className="mb-4 text-2xl font-bold">
          📝 Interactive Practice
        </h2>


        <Quiz />


      </section>




      {/* Complete Lesson + Navigation */}

      <div className="flex justify-between items-center">


        <Link
          href="/learn"
          className="rounded-lg border px-5 py-3 hover:bg-gray-100"
        >

          ← Back

        </Link>



        <LessonComplete />


      </div>



    </main>

  );

}
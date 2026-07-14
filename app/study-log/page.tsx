"use client";

import { useEffect, useState } from "react";

export default function StudyLogPage() {
  const [log, setLog] = useState({
    date: "",
    hours: "",
    mcq: "",
    accuracy: "",
    note: "",
  });

  const [savedLog, setSavedLog] = useState<any[]>([]);

  // Load data from Local Storage
  useEffect(() => {
    const data = localStorage.getItem("studyLogs");

    if (data) {
      setSavedLog(JSON.parse(data));
    }
  }, []);

  function handleSave() {
    const updatedLogs = [...savedLog, log];

    setSavedLog(updatedLogs);

    localStorage.setItem(
      "studyLogs",
      JSON.stringify(updatedLogs)
    );

    setLog({
      date: "",
      hours: "",
      mcq: "",
      accuracy: "",
      note: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">
      <h1 className="text-4xl font-bold">
        📅 Daily Study Log
      </h1>

      <p className="mt-2 text-gray-600">
        Add your daily BCS preparation record.
      </p>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          ✍️ Add New Log
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <input
            type="date"
            value={log.date}
            onChange={(e) =>
              setLog({ ...log, date: e.target.value })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />

          <input
            placeholder="Study Hour (Example: 4h)"
            value={log.hours}
            onChange={(e) =>
              setLog({ ...log, hours: e.target.value })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />

          <input
            placeholder="MCQ Done"
            value={log.mcq}
            onChange={(e) =>
              setLog({ ...log, mcq: e.target.value })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />

          <input
            placeholder="Accuracy %"
            value={log.accuracy}
            onChange={(e) =>
              setLog({ ...log, accuracy: e.target.value })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />

        </div>

        <textarea
          placeholder="Today's Note"
          value={log.note}
          onChange={(e) =>
            setLog({ ...log, note: e.target.value })
          }
          className="mt-4 w-full rounded-lg bg-[#FFF8E7] p-3"
        />

        <button
          onClick={handleSave}
          className="mt-5 rounded-lg bg-emerald-500 px-6 py-3 font-bold text-white"
        >
          💾 Save Log
        </button>
      </div>


      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          📚 Previous Logs
        </h2>

        <div className="mt-5 space-y-4">
          {savedLog.map((item, index) => (
            <div
              key={index}
              className="rounded-lg bg-[#FFF8E7] p-5"
            >
              <p>📅 Date: {item.date}</p>

              <p>
                ⏱ Study Hour: {item.hours}
              </p>

              <p>
                📝 MCQ: {item.mcq}
              </p>

              <p>
                🎯 Accuracy: {item.accuracy}
              </p>

              <p>
                📌 Note: {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
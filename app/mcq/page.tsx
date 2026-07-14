export default function MCQPage() {
  const stats = [
    {
      title: "📝 Total MCQ",
      value: "400",
    },
    {
      title: "✅ Correct",
      value: "360",
    },
    {
      title: "❌ Wrong",
      value: "40",
    },
    {
      title: "🎯 Accuracy",
      value: "90%",
    },
  ];

  const subjects = [
    {
      name: "📖 বাংলা",
      mcq: "120 MCQ",
    },
    {
      name: "🇬🇧 English",
      mcq: "80 MCQ",
    },
    {
      name: "➗ Math",
      mcq: "60 MCQ",
    },
    {
      name: "🌍 General Knowledge",
      mcq: "140 MCQ",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">
      <h1 className="text-4xl font-bold">
        📝 MCQ Tracker
      </h1>

      <p className="mt-2 text-gray-600">
        Track your BCS MCQ practice performance.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-600">
              {item.title}
            </h2>

            <p className="mt-4 text-4xl font-bold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          📚 Subject Wise MCQ
        </h2>

        <div className="mt-5 space-y-4">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="flex justify-between rounded-lg bg-gray-50 p-4"
            >
              <span className="font-semibold">
                {subject.name}
              </span>

              <span className="text-gray-600">
                {subject.mcq}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
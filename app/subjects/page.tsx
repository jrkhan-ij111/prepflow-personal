export default function SubjectsPage() {
  const subjects = [
    {
      name: "📖 বাংলা",
      progress: "80%",
      topics: "সমাস, সন্ধি, ব্যাকরণ",
    },
    {
      name: "🇬🇧 English",
      progress: "60%",
      topics: "Grammar, Vocabulary",
    },
    {
      name: "➗ Math",
      progress: "50%",
      topics: "Probability, Arithmetic",
    },
    {
      name: "🌍 General Knowledge",
      progress: "70%",
      topics: "Bangladesh, International",
    },
    {
      name: "💻 ICT",
      progress: "40%",
      topics: "Computer Basics",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">
      <h1 className="text-4xl font-bold">
        📚 Subjects
      </h1>

      <p className="mt-2 text-gray-600">
        Track your BCS subject preparation progress.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold">
              {subject.name}
            </h2>

            <p className="mt-3 text-gray-600">
              {subject.topics}
            </p>

            <p className="mt-5 text-3xl font-bold text-blue-600">
              {subject.progress}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
"use client";

export default function LibraryPage() {
  const books = [
    {
      id: 1,
      title: "বাংলা ব্যাকরণ (Preceptor)",
      subject: "বাংলা",
      file: "/books/bangla/grammar/Bangla_Bakoron.pdf",
      status: "Available",
    },

    {
      id: 2,
      title: "Preceptors BCS Preliminary Digest",
      subject: "সকল বিষয়",
      file: "/books/digest/Preceptors_BCS_Preliminary_Digest.pdf",
      status: "Available",
    },

    {
      id: 3,
      title: "BIBM Bank Job Solution",
      subject: "ব্যাংক",
      file: "/books/bank/BIBM_Bank_Job_Solution.pdf",
      status: "Available",
    },

    {
      id: 4,
      title: "Master English",
      subject: "ইংরেজি",
      file: "/books/english/Master_English.pdf",
      status: "Available",
    },

    {
      id: 5,
      title: "Khairul's Advanced Math",
      subject: "গণিত",
      file: "/books/math/Khairul's_Advanced_Math.pdf",
      status: "Available",
    },

    {
      id: 6,
      title: "Higher Math",
      subject: "গণিত",
      file: "/books/math/Higher_Math.pdf",
      status: "Available",
    },

    {
      id: 7,
      title: "Class Eight Math",
      subject: "গণিত",
      file: "/books/math/Class_Eight_Math.pdf",
      status: "Available",
    },

    {
      id: 8,
      title: "Science Class",
      subject: "বিজ্ঞান",
      file: "/books/science/Science_Class.pdf",
      status: "Available",
    },

    {
      id: 9,
      title: "Bangladesh General Studies (English)",
      subject: "সাধারণ জ্ঞান",
      file: "/books/gk/BGS.pdf",
      status: "Available",
    },

    {
      id: 10,
      title: "Bangladesh General Studies (Bangla)",
      subject: "সাধারণ জ্ঞান",
      file: "/books/gk/BGS_Bangla_Version.pdf",
      status: "Available",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">
      <h1 className="text-4xl font-bold">
        📚 Knowledge Library
      </h1>

      <p className="mt-2 text-gray-600">
        All your BCS books in one place.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">
              📘 {book.title}
            </h2>

            <p className="mt-3">
              <strong>Subject:</strong> {book.subject}
            </p>

            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <span className="font-semibold text-emerald-600">
                {book.status}
              </span>
            </p>

            <a
              href={book.file}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              📖 Open PDF
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
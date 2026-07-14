export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          PrepFlow Personal
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back! Continue your BCS preparation.
        </p>
      </div>

      <div className="rounded-xl bg-white px-5 py-3 shadow-sm text-gray-800">
        🔥 Study Streak: 7 Days
      </div>
    </header>
  );
}
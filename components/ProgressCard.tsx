export default function ProgressCard() {
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        📖 Subject Progress
      </h2>

      <div className="space-y-6">
        <Progress subject="বাংলা" percent="80%" width="w-4/5" />
        <Progress subject="English" percent="60%" width="w-3/5" />
        <Progress subject="Math" percent="50%" width="w-1/2" />
        <Progress subject="GK" percent="70%" width="w-7/10" />
      </div>
    </div>
  );
}

function Progress({
  subject,
  percent,
  width,
}: {
  subject: string;
  percent: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-gray-700">
        <span>{subject}</span>
        <span>{percent}</span>
      </div>

      <div className="h-3 rounded-full bg-gray-200">
        <div
          className={`h-3 rounded-full bg-blue-500 ${width}`}
        ></div>
      </div>
    </div>
  );
}
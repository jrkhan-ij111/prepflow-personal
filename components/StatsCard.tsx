type StatsCardProps = {
  title: string;
  value: string;
};

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-600">
        {title}
      </h2>

      <p className="mt-4 text-4xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Today's Progress
      </p>
    </div>
  );
}
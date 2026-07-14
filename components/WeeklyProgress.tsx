"use client";

export default function WeeklyProgress() {

  const weekData = [
    {
      day: "Monday",
      hours: "3h",
      mcq: "200",
    },
    {
      day: "Tuesday",
      hours: "4h",
      mcq: "300",
    },
    {
      day: "Wednesday",
      hours: "5h",
      mcq: "400",
    },
    {
      day: "Thursday",
      hours: "4h",
      mcq: "250",
    },
    {
      day: "Friday",
      hours: "3h",
      mcq: "200",
    },
  ];


  const totalHours = weekData.reduce(
    (sum, item) =>
      sum + Number(item.hours.replace("h", "")),
    0
  );


  const totalMCQ = weekData.reduce(
    (sum, item) =>
      sum + Number(item.mcq),
    0
  );


  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        📈 Weekly Progress
      </h2>


      <div className="mt-5 grid gap-4 md:grid-cols-2">

        <div className="rounded-lg bg-[#FFF8E7] p-5">
          <p className="text-gray-600">
            ⏱ Total Study Hours
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalHours}h
          </p>
        </div>


        <div className="rounded-lg bg-[#FFF8E7] p-5">
          <p className="text-gray-600">
            📝 Total MCQ
          </p>

          <p className="mt-2 text-3xl font-bold">
            {totalMCQ}
          </p>
        </div>

      </div>


      <div className="mt-6 space-y-3">

        {weekData.map((item) => (

          <div
            key={item.day}
            className="flex justify-between rounded-lg bg-[#FFF8E7] p-4"
          >

            <span className="font-semibold">
              {item.day}
            </span>


            <span>
              ⏱ {item.hours} | 📝 {item.mcq} MCQ
            </span>


          </div>

        ))}

      </div>


    </div>
  );
}
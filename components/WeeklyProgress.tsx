"use client";


type WeekData = {
  day: string;
  hours: number;
  mcq: number;
};



export default function WeeklyProgress() {


  const weekGoal = {
    hours: 25,
    mcq: 1000,
  };


  const weekData: WeekData[] = [
    {
      day: "Monday",
      hours: 3,
      mcq: 200,
    },
    {
      day: "Tuesday",
      hours: 4,
      mcq: 300,
    },
    {
      day: "Wednesday",
      hours: 5,
      mcq: 400,
    },
    {
      day: "Thursday",
      hours: 4,
      mcq: 250,
    },
    {
      day: "Friday",
      hours: 3,
      mcq: 200,
    },
  ];



  const totalHours =
    weekData.reduce(
      (sum,item) =>
        sum + item.hours,
      0
    );



  const totalMCQ =
    weekData.reduce(
      (sum,item) =>
        sum + item.mcq,
      0
    );



  const hourProgress =
    Math.min(
      Math.round(
        (totalHours / weekGoal.hours) * 100
      ),
      100
    );



  const mcqProgress =
    Math.min(
      Math.round(
        (totalMCQ / weekGoal.mcq) * 100
      ),
      100
    );



  return (

    <section
      className="
        mt-8
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
      "
    >


      <h2 className="text-2xl font-extrabold">
        📈 Weekly Progress
      </h2>




      {/* Summary Cards */}

      <div className="
        mt-5
        grid
        grid-cols-1
        gap-4
        md:grid-cols-2
      ">


        <div className="rounded-xl bg-[#FFF8E7] p-5">

          <p className="text-gray-600">
            ⏱ Total Study Hours
          </p>


          <p className="mt-2 text-3xl font-extrabold">
            {totalHours}h
          </p>


          <div className="mt-3 h-2 rounded-full bg-[#FFF1CC]">

            <div
              className="
                h-2
                rounded-full
                bg-emerald-500
                transition-all
              "
              style={{
                width:`${hourProgress}%`
              }}
            />

          </div>


          <p className="mt-2 text-sm text-gray-500">
            Goal: {weekGoal.hours}h ({hourProgress}%)
          </p>


        </div>





        <div className="rounded-xl bg-[#FFF8E7] p-5">

          <p className="text-gray-600">
            📝 Total MCQ
          </p>


          <p className="mt-2 text-3xl font-extrabold">
            {totalMCQ}
          </p>



          <div className="mt-3 h-2 rounded-full bg-[#FFF1CC]">

            <div
              className="
                h-2
                rounded-full
                bg-blue-500
                transition-all
              "
              style={{
                width:`${mcqProgress}%`
              }}
            />

          </div>


          <p className="mt-2 text-sm text-gray-500">
            Goal: {weekGoal.mcq} MCQ ({mcqProgress}%)
          </p>


        </div>


      </div>






      {/* Daily Breakdown */}

      <div className="mt-6 space-y-3">


        {weekData.map((item)=>(

          <div
            key={item.day}
            className="
              flex
              flex-col
              gap-2
              rounded-xl
              bg-[#FFF8E7]
              p-4
              transition
              hover:bg-[#FFF1CC]

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >


            <span className="font-bold">
              {item.day}
            </span>


            <span className="text-gray-700">
              ⏱ {item.hours}h
              {" | "}
              📝 {item.mcq} MCQ
            </span>


          </div>


        ))}


      </div>



    </section>

  );

}
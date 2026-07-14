"use client";

import { useEffect, useState } from "react";

export default function DailyTarget() {

  const defaultTargets = [
    {
      title: "বাংলা ব্যাকরণ Revision",
      done: false,
    },
    {
      title: "100 MCQ Practice",
      done: false,
    },
    {
      title: "Vocabulary Revision",
      done: false,
    },
    {
      title: "Current Affairs Update",
      done: false,
    },
    {
      title: "Math Practice",
      done: false,
    },
  ];


  const [targets, setTargets] = useState(defaultTargets);


  // Load saved target
  useEffect(() => {

    const saved =
      localStorage.getItem("dailyTargets");


    if (saved) {
      setTargets(JSON.parse(saved));
    }

  }, []);



  function toggleTarget(index:number) {

    const updated = [...targets];

    updated[index].done =
      !updated[index].done;


    setTargets(updated);


    localStorage.setItem(
      "dailyTargets",
      JSON.stringify(updated)
    );

  }



  const completed =
    targets.filter(
      (item) => item.done
    ).length;


  const progress =
    Math.round(
      (completed / targets.length) * 100
    );



  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        🎯 Today's Target
      </h2>


      <div className="mt-5 space-y-3">

        {targets.map((item,index)=>(

          <label
            key={index}
            className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#FFF8E7] p-3"
          >

            <input
              type="checkbox"
              checked={item.done}
              onChange={() =>
                toggleTarget(index)
              }
            />


            <span
              className={
                item.done
                ? "line-through text-gray-400"
                : ""
              }
            >
              {item.title}
            </span>


          </label>

        ))}

      </div>



      <div className="mt-6">

        <p className="font-bold">
          Progress: {completed}/{targets.length}
        </p>


        <div className="mt-2 h-3 rounded-full bg-[#FFF1CC]">

          <div
            className="h-3 rounded-full bg-emerald-500"
            style={{
              width:`${progress}%`
            }}
          ></div>

        </div>


        <p className="mt-2 text-gray-600">
          {progress}% Complete
        </p>


      </div>


    </div>
  );
}
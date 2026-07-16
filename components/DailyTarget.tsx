"use client";

import { useEffect, useState } from "react";


type Target = {
  title: string;
  done: boolean;
};


const defaultTargets: Target[] = [
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



export default function DailyTarget() {

  const [targets, setTargets] =
    useState<Target[]>(defaultTargets);



  useEffect(() => {

    try {

      const saved =
        localStorage.getItem("dailyTargets");


      if (saved) {

        setTargets(
          JSON.parse(saved)
        );

      }


    } catch(error){

      console.log(
        "Daily target load error:",
        error
      );

    }

  }, []);




  function toggleTarget(index:number) {


    const updatedTargets =
      targets.map((item, i) =>
        i === index
          ? {
              ...item,
              done: !item.done,
            }
          : item
      );


    setTargets(updatedTargets);


    localStorage.setItem(
      "dailyTargets",
      JSON.stringify(updatedTargets)
    );

  }




  const completed =
    targets.filter(
      item => item.done
    ).length;



  const progress =
    targets.length > 0
      ? Math.round(
          (completed / targets.length) * 100
        )
      : 0;




  return (

    <section className="
      mt-8
      rounded-2xl
      bg-white
      p-6
      shadow-sm
      transition
      hover:shadow-md
    ">


      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-extrabold">
          🎯 Today's Target
        </h2>


        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
          {progress}%
        </span>

      </div>




      <div className="mt-5 space-y-3">


        {targets.map((item,index)=>(

          <label
            key={item.title}
            className="
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              bg-[#FFF8E7]
              p-4
              transition
              hover:bg-[#FFF1CC]
            "
          >


            <input
              type="checkbox"
              checked={item.done}
              onChange={() =>
                toggleTarget(index)
              }
              className="
                h-5
                w-5
                accent-emerald-500
              "
            />



            <span
              className={
                item.done
                  ? "text-gray-400 line-through"
                  : "font-medium text-gray-800"
              }
            >
              {item.title}
            </span>


          </label>


        ))}


      </div>





      {/* Progress */}

      <div className="mt-6">


        <div className="flex justify-between text-sm font-bold">

          <span>
            Completed
          </span>

          <span>
            {completed}/{targets.length}
          </span>

        </div>



        <div className="
          mt-3
          h-3
          overflow-hidden
          rounded-full
          bg-[#FFF1CC]
        ">

          <div
            className="
              h-full
              rounded-full
              bg-emerald-500
              transition-all
              duration-500
            "
            style={{
              width:`${progress}%`
            }}
          />

        </div>


      </div>



    </section>

  );
}
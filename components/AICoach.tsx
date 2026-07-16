"use client";

import { useEffect, useState } from "react";

import { analyzePerformance } from "@/data/aiCoach";
import { getRecommendation } from "@/data/recommendation";


type AIReport = {
  topic: string;
  attempt: number;
  correct: number;
  accuracy: number;
  masteryLevel: string;
  masteryColor: string;
  masteryMessage: string;
  status: "Weak" | "Good";
};



export default function AICoach() {


  const [report, setReport] =
    useState<AIReport[]>([]);



  useEffect(() => {


    try {


      const data =
        localStorage.getItem("mcqRecords");


      if (!data) return;



      const records =
        JSON.parse(data);



      const result =
        analyzePerformance(records);


      const normalizedResult: AIReport[] = result.map(
        (item: any) => ({
          ...item,
          status: item.status === "Weak" ? "Weak" : "Good",
        })
      );


      setReport(normalizedResult);


    } catch(error){

      console.log(
        "AI Coach loading error:",
        error
      );

    }


  }, []);






  return (

    <section
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
      "
    >


      <h2 className="text-2xl font-extrabold">
        🤖 AI Coach Report
      </h2>





      {report.length === 0 ? (

        <div className="
          mt-5
          rounded-xl
          bg-[#FFF8E7]
          p-5
          text-gray-600
        ">

          <p>
            এখনো কোনো Quiz Data নেই।
          </p>

          <p className="mt-2 text-sm">
            MCQ Practice শুরু করলে AI Coach
            তোমার দুর্বলতা ও উন্নতির পরামর্শ দেবে।
          </p>

        </div>


      ) : (


        <div className="mt-6 space-y-6">


          {report.map((item)=>{


            const recommendation =
              getRecommendation(
                item.accuracy
              );



            return (

              <div
                key={item.topic}
                className="
                  rounded-2xl
                  border
                  p-5
                  transition
                  hover:shadow-sm
                "
              >



                <h3 className="text-xl font-extrabold">
                  📘 {item.topic}
                </h3>




                {/* Performance */}

                <div className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-3
                ">


                  <div className="rounded-lg bg-gray-50 p-3">
                    📝 Attempt
                    <br />
                    <b>{item.attempt}</b>
                  </div>


                  <div className="rounded-lg bg-gray-50 p-3">
                    ✅ Correct
                    <br />
                    <b>{item.correct}</b>
                  </div>


                  <div className="rounded-lg bg-gray-50 p-3">
                    🎯 Accuracy
                    <br />
                    <b>{item.accuracy}%</b>
                  </div>


                </div>





                {/* Mastery */}

                <div className="
                  mt-5
                  rounded-xl
                  bg-gray-50
                  p-4
                ">


                  <p
                    className={`
                      text-lg
                      font-extrabold
                      ${item.masteryColor}
                    `}
                  >
                    {item.masteryLevel}
                  </p>


                  <p className="mt-2 text-gray-600">
                    {item.masteryMessage}
                  </p>


                </div>






                {/* Status */}

                <div className="mt-4">

                  {item.status === "Weak" ? (

                    <p className="font-bold text-red-600">
                      ⚠️ Weak Topic - Revision Needed
                    </p>

                  ) : (

                    <p className="font-bold text-green-600">
                      ✅ Good Progress
                    </p>

                  )}

                </div>







                {/* AI Suggestion */}

                <div className="
                  mt-5
                  rounded-xl
                  bg-blue-50
                  p-4
                ">


                  <h4 className="font-extrabold">
                    🤖 AI Suggestion
                  </h4>



                  <p className="mt-3 text-gray-700">
                    {recommendation.message}
                  </p>




                  <ul className="
                    mt-3
                    list-disc
                    space-y-1
                    pl-5
                  ">

                    {recommendation.actions.map(
                      (action,index)=>(
                        <li key={index}>
                          {action}
                        </li>
                      )
                    )}

                  </ul>


                </div>




              </div>

            );


          })}


        </div>


      )}



    </section>

  );

}
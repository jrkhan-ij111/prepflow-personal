"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {

  const [totalMCQ, setTotalMCQ] = useState(0);
  const [accuracy, setAccuracy] = useState("0%");
  const [mastered, setMastered] = useState(0);
  const [learning, setLearning] = useState(0);
  const [subjects, setSubjects] = useState<any[]>([]);



  useEffect(() => {

    const data =
      localStorage.getItem("mcqMastery");


    if(data){

      const records = JSON.parse(data);


      setTotalMCQ(records.length);



      const masteredCount =
        records.filter(
          (item:any)=>
            item.status==="🏆 Mastered"
        ).length;


      const learningCount =
        records.filter(
          (item:any)=>
            item.status==="📚 Learning"
        ).length;



      setMastered(masteredCount);
      setLearning(learningCount);



      const totalCorrect =
        records.reduce(
          (sum:number,item:any)=>
          sum + Number(item.correct),
          0
        );



      const totalAttempt =
        records.reduce(
          (sum:number,item:any)=>
          sum +
          Number(item.correct)
          +
          Number(item.wrong),
          0
        );



      if(totalAttempt){

        setAccuracy(
          `${Math.round(
            (totalCorrect/totalAttempt)*100
          )}%`
        );

      }



      const subjectData:any = {};



      records.forEach((item:any)=>{


        if(!subjectData[item.subject]){

          subjectData[item.subject]={
            correct:0,
            total:0
          };

        }


        subjectData[item.subject].correct +=
          Number(item.correct);


        subjectData[item.subject].total +=
          Number(item.correct)
          +
          Number(item.wrong);


      });



      const subjectArray =
        Object.keys(subjectData).map(
          (key)=>({

            name:key,

            accuracy:
              Math.round(
                (
                  subjectData[key].correct /
                  subjectData[key].total
                )
                *100
              )

          })
        );


      setSubjects(subjectArray);


    }


  },[]);



  return (

    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">


      <h1 className="text-4xl font-bold">
        📊 Analytics
      </h1>


      <p className="mt-2 text-gray-600">
        Your BCS preparation performance.
      </p>



      <div className="mt-8 grid gap-6 md:grid-cols-4">


        <div className="rounded-xl bg-white p-6 shadow-sm">

          📝 Total MCQ

          <p className="mt-3 text-3xl font-bold">
            {totalMCQ}
          </p>

        </div>



        <div className="rounded-xl bg-white p-6 shadow-sm">

          🎯 Accuracy

          <p className="mt-3 text-3xl font-bold">
            {accuracy}
          </p>

        </div>



        <div className="rounded-xl bg-white p-6 shadow-sm">

          🏆 Mastered

          <p className="mt-3 text-3xl font-bold">
            {mastered}
          </p>

        </div>



        <div className="rounded-xl bg-white p-6 shadow-sm">

          📚 Learning

          <p className="mt-3 text-3xl font-bold">
            {learning}
          </p>

        </div>


      </div>




      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold">
          📖 Subject Performance
        </h2>



        <div className="mt-5 space-y-4">


          {subjects.map((item,index)=>(


            <div
              key={index}
              className="rounded-lg bg-[#FFF8E7] p-4"
            >

              <div className="flex justify-between">

                <span className="font-semibold">
                  {item.name}
                </span>


                <span>
                  {item.accuracy}%
                </span>

              </div>



              <div className="mt-2 h-3 rounded-full bg-[#FFE9A8]">


                <div
                  className="h-3 rounded-full bg-emerald-500"
                  style={{
                    width:`${item.accuracy}%`
                  }}
                >

                </div>


              </div>


            </div>


          ))}


        </div>


      </div>



    </main>

  );

}
"use client";

import { useEffect, useState } from "react";

export default function MCQMasteryPage() {

  const [mcq, setMcq] = useState({
    subject: "",
    topic: "",
    correct: "",
    wrong: "",
  });


  const [records, setRecords] = useState<any[]>([]);



  useEffect(() => {

    const data =
      localStorage.getItem("mcqMastery");


    if(data){
      setRecords(JSON.parse(data));
    }

  },[]);




  function saveMCQ(){

    const correct =
      Number(mcq.correct);

    const wrong =
      Number(mcq.wrong);


    const total =
      correct + wrong;


    const accuracy =
      total > 0
      ? Math.round(
          (correct / total) * 100
        )
      : 0;



    const newRecord = {

      ...mcq,

      accuracy: `${accuracy}%`,

      status:
        correct >= 3
        ? "🏆 Mastered"
        : "📚 Learning"

    };



    const updated = [
      ...records,
      newRecord
    ];



    setRecords(updated);



    localStorage.setItem(
      "mcqMastery",
      JSON.stringify(updated)
    );



    setMcq({

      subject:"",
      topic:"",
      correct:"",
      wrong:""

    });

  }




  return (

    <main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">


      <h1 className="text-4xl font-bold">
        📝 MCQ Mastery Tracker
      </h1>


      <p className="mt-2 text-gray-600">
        Track your BCS MCQ accuracy and mastery.
      </p>




      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold">
          Add MCQ Record
        </h2>



        <div className="mt-5 grid gap-4 md:grid-cols-2">


          <input
            placeholder="Subject"
            value={mcq.subject}
            onChange={(e)=>
              setMcq({
                ...mcq,
                subject:e.target.value
              })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />



          <input
            placeholder="Topic"
            value={mcq.topic}
            onChange={(e)=>
              setMcq({
                ...mcq,
                topic:e.target.value
              })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />



          <input
            placeholder="Correct"
            value={mcq.correct}
            onChange={(e)=>
              setMcq({
                ...mcq,
                correct:e.target.value
              })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />



          <input
            placeholder="Wrong"
            value={mcq.wrong}
            onChange={(e)=>
              setMcq({
                ...mcq,
                wrong:e.target.value
              })
            }
            className="rounded-lg bg-[#FFF8E7] p-3"
          />

        </div>



        <button
          onClick={saveMCQ}
          className="mt-5 rounded-lg bg-emerald-500 px-6 py-3 font-bold text-white"
        >
          💾 Save MCQ
        </button>


      </div>





      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold">
          📊 MCQ Performance
        </h2>



        <div className="mt-5 space-y-4">


        {records.map((item,index)=>(


          <div
            key={index}
            className="rounded-lg bg-[#FFF8E7] p-5"
          >

            <p>
              📖 {item.subject}
            </p>


            <p>
              📝 {item.topic}
            </p>


            <p>
              ✅ Correct: {item.correct}
            </p>


            <p>
              ❌ Wrong: {item.wrong}
            </p>


            <p>
              🎯 Accuracy: {item.accuracy}
            </p>


            <p>
              Status: {item.status}
            </p>


          </div>


        ))}


        </div>


      </div>


    </main>

  );

}
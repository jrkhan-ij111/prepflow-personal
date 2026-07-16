"use client";

import { useEffect, useState } from "react";


type RevisionItem = {
  subject: string;
  topic: string;
  correct: string;
  wrong: string;
  accuracy: string;
  status: string;
};



export default function RevisionPage() {

  const [records, setRecords] =
    useState<RevisionItem[]>([]);


  const [filter, setFilter] =
    useState("All");



  useEffect(() => {

    const data =
      localStorage.getItem(
        "mcqMastery"
      );


    if(data){

      setRecords(
        JSON.parse(data)
      );

    }


  }, []);





  const filteredRecords =
    filter === "All"
    ?
    records
    :
    records.filter(
      item =>
        item.status === filter
    );





  return (

    <main className="
      min-h-screen
      bg-[#FFF8E7]
      p-4
      md:p-8
      text-gray-900
    ">


      <h1 className="
        text-3xl
        font-extrabold
        md:text-4xl
      ">
        🔁 Revision Bank
      </h1>


      <p className="mt-2 text-gray-600">
        Revise your MCQ mistakes and strengthen weak topics.
      </p>




      {/* Filter */}

      <div className="mt-6 flex flex-wrap gap-3">

        {[
          "All",
          "🏆 Mastered",
          "📚 Learning"
        ].map(item=>(

          <button

            key={item}

            onClick={() =>
              setFilter(item)
            }

            className={`
              rounded-xl
              px-4
              py-2
              font-bold

              ${
                filter === item
                ?
                "bg-emerald-500 text-white"
                :
                "bg-white"
              }
            `}
          >

            {item}

          </button>


        ))}

      </div>





      {/* Records */}


      <div className="
        mt-8
        grid
        gap-5
        md:grid-cols-2
        lg:grid-cols-3
      ">


      {
        filteredRecords.length > 0
        ?

        filteredRecords.map((item,index)=>(


          <div
            key={index}
            className="
              rounded-2xl
              bg-white
              p-6
              shadow-sm
            "
          >


            <h2 className="text-xl font-bold">
              📖 {item.subject}
            </h2>


            <p className="mt-3 font-semibold">
              📝 {item.topic}
            </p>



            <div className="mt-4 space-y-2">

              <p>
                ✅ Correct:
                {" "}
                {item.correct}
              </p>


              <p>
                ❌ Wrong:
                {" "}
                {item.wrong}
              </p>


              <p>
                🎯 Accuracy:
                {" "}
                {item.accuracy}
              </p>


            </div>





            <div className="
              mt-5
              rounded-xl
              bg-gray-50
              p-4
            ">

              <p className="font-bold">
                Status:
              </p>

              <p>
                {item.status}
              </p>

            </div>


          </div>


        ))

        :

        <div className="
          rounded-xl
          bg-white
          p-6
        ">
          এখনো কোনো Revision Data নেই।
        </div>

      }


      </div>


    </main>

  );

}
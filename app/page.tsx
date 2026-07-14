"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DailyTarget from "@/components/DailyTarget";
import WeeklyProgress from "@/components/WeeklyProgress";
import AICoach from "@/components/AICoach";


export default function Home() {


  const [studyHours, setStudyHours] = useState("0h");
  const [mcq, setMcq] = useState("0");
  const [accuracy, setAccuracy] = useState("0%");

  const [mastered, setMastered] = useState(0);
  const [learning, setLearning] = useState(0);



  useEffect(() => {


    const studyData =
      localStorage.getItem("studyLogs");


    if (studyData) {


      const logs =
        JSON.parse(studyData);



      if(logs.length > 0){


        const totalHours =
          logs.reduce(
            (sum:number,item:any)=>
            sum + Number(item.hours.replace("h","")),
            0
          );



        const totalMCQ =
          logs.reduce(
            (sum:number,item:any)=>
            sum + Number(item.mcq),
            0
          );



        const avgAccuracy =
          logs.reduce(
            (sum:number,item:any)=>
            sum + Number(item.accuracy.replace("%","")),
            0
          ) / logs.length;



        setStudyHours(
          `${totalHours}h`
        );


        setMcq(
          totalMCQ.toString()
        );


        setAccuracy(
          `${Math.round(avgAccuracy)}%`
        );


      }


    }




    const mcqData =
      localStorage.getItem("mcqMastery");



    if(mcqData){


      const records =
      JSON.parse(mcqData);



      setMastered(
        records.filter(
          (item:any)=>
          item.status==="🏆 Mastered"
        ).length
      );



      setLearning(
        records.filter(
          (item:any)=>
          item.status==="📚 Learning"
        ).length
      );


    }



  },[]);





return (


<main className="
flex
min-h-screen
bg-[#FFF8E7]
text-gray-900
">



<Sidebar />





<section className="
flex-1
p-8
">



<Header />






<div className="
mt-8
grid
gap-6
md:grid-cols-5
">





<div className="rounded-xl bg-white p-6 shadow-sm">

<h2 className="font-semibold">
📚 Study Hours
</h2>

<p className="mt-3 text-3xl font-bold">
{studyHours}
</p>

</div>






<div className="rounded-xl bg-white p-6 shadow-sm">

<h2 className="font-semibold">
📝 MCQ
</h2>

<p className="mt-3 text-3xl font-bold">
{mcq}
</p>

</div>







<div className="rounded-xl bg-white p-6 shadow-sm">

<h2 className="font-semibold">
🎯 Accuracy
</h2>

<p className="mt-3 text-3xl font-bold">
{accuracy}
</p>

</div>






<div className="rounded-xl bg-white p-6 shadow-sm">

<h2 className="font-semibold">
🏆 Mastered
</h2>

<p className="mt-3 text-3xl font-bold">
{mastered}
</p>

</div>






<div className="rounded-xl bg-white p-6 shadow-sm">

<h2 className="font-semibold">
📚 Learning
</h2>

<p className="mt-3 text-3xl font-bold">
{learning}
</p>

</div>




</div>






<DailyTarget />



<WeeklyProgress />






{/* AI Coach */}

<div
id="aicoach"
className="mt-8"
>


<AICoach />


</div>






</section>




</main>


);


}
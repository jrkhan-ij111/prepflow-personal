import AiCoachPanel from "@/components/ai-coach/panel";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DailyTarget from "@/components/DailyTarget";
import WeeklyProgress from "@/components/WeeklyProgress";
import AICoach from "@/components/AICoach";


export default function Home() {


  const [studyHours,setStudyHours] = useState("0h");
  const [mcq,setMcq] = useState("0");
  const [accuracy,setAccuracy] = useState("0%");

  const [mastered,setMastered] = useState(0);
  const [learning,setLearning] = useState(0);



  useEffect(()=>{


    const studyData =
    localStorage.getItem("studyLogs");


    if(studyData){

      const logs =
      JSON.parse(studyData);


      if(logs.length > 0){


        const totalHours =
        logs.reduce(
          (sum:number,item:any)=>
          sum +
          Number(item.hours.replace("h","")),
          0
        );


        const totalMCQ =
        logs.reduce(
          (sum:number,item:any)=>
          sum +
          Number(item.mcq),
          0
        );


        const avg =
        logs.reduce(
          (sum:number,item:any)=>
          sum +
          Number(item.accuracy.replace("%","")),
          0
        ) / logs.length;



        setStudyHours(`${totalHours}h`);
        setMcq(String(totalMCQ));
        setAccuracy(`${Math.round(avg)}%`);

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

<main
className="
flex
min-h-screen
min-w-[900px]
bg-[#FFF8E7]
text-gray-900
"
>


<Sidebar />



<section
className="
w-full
ml-48
p-8
"
>


<Header />



<div
className="
mt-8
grid
grid-cols-5
gap-6
"
>


<Card
title="📚 Study Hours"
value={studyHours}
/>


<Card
title="📝 MCQ"
value={mcq}
/>


<Card
title="🎯 Accuracy"
value={accuracy}
/>


<Card
title="🏆 Mastered"
value={String(mastered)}
/>


<Card
title="📚 Learning"
value={String(learning)}
/>


</div>




<DailyTarget />


<WeeklyProgress />



<div
id="aicoach"
className="mt-8"
>

<AICoach/>

</div>



</section>


</main>

);

}





function Card({
title,
value
}:{
title:string;
value:string;
}){


return (

<div
className="
rounded-xl
bg-white
p-6
shadow-sm
"
>

<h2 className="font-semibold">
{title}
</h2>


<p
className="
mt-3
text-3xl
font-bold
"
>
{value}
</p>


</div>

);

}
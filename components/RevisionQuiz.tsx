"use client";

import { useEffect, useState } from "react";
import { saveQuizResult } from "@/data/saveQuiz";



export default function RevisionQuiz(){


const [questions,setQuestions] =
useState<any[]>([]);


const [current,setCurrent] =
useState(0);



const [score,setScore] =
useState(0);



const [selected,setSelected] =
useState("");



const [finished,setFinished] =
useState(false);





useEffect(()=>{


const data =
localStorage.getItem(
"wrongMCQ"
);



if(data){


setQuestions(
JSON.parse(data)
);


}


},[]);








function answer(option:string){


if(selected) return;



setSelected(option);



const question =
questions[current];



const correct =
option === question.correctAnswer;



if(correct){

setScore(score+1);

}




saveQuizResult({

id:Date.now(),

topic:question.topic,

question:question.question,

correct,

selectedAnswer:option,

correctAnswer:question.correctAnswer,

date:new Date().toISOString()


});


}







function next(){


setSelected("");



if(current < questions.length-1){


setCurrent(current+1);


}

else{


setFinished(true);


}


}








if(questions.length===0){


return (

<div className="
rounded-xl
bg-white
p-6
">


<h2 className="text-xl font-bold">

🎉 No Wrong Question Available

</h2>


</div>

);


}






if(finished){


return (

<div className="
rounded-xl
bg-white
p-6
">


<h2 className="text-2xl font-bold">

🎯 Revision Complete

</h2>


<p className="mt-4">

Score:

{score}/{questions.length}

</p>


</div>

);


}








const question =
questions[current];





return (

<div className="
rounded-xl
bg-white
p-6
shadow-sm
">


<h2 className="text-2xl font-bold">

🔁 Mistake Revision

</h2>



<p className="mt-5 font-semibold">

{question.question}

</p>





<div className="mt-5 space-y-3">


{

[

question.correctAnswer,

question.selectedAnswer

].map((option:string)=>(


<button

key={option}

onClick={()=>answer(option)}

className="
w-full
rounded-lg
border
p-3
text-left
hover:bg-emerald-50
"

>

{option}

</button>


))


}



</div>






{

selected && (

<button

onClick={next}

className="
mt-6
rounded-lg
bg-emerald-500
px-5
py-3
text-white
font-semibold
"

>

Next →

</button>


)

}





</div>

);


}
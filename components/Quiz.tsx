"use client";

import { useState } from "react";

import { mcqs } from "@/data/mcq";
import { saveQuizResult } from "@/data/saveQuiz";
import { saveWrongMCQ } from "@/data/wrongMCQ";



export default function Quiz(){


const [current,setCurrent] =
useState(0);


const [selected,setSelected] =
useState("");



const [score,setScore] =
useState(0);



const [finished,setFinished] =
useState(false);






function handleAnswer(option:string){


if(selected) return;



setSelected(option);



const question =
mcqs[current];



const correct =
option === question.answer;



if(correct){

setScore(score + 1);

}





// সব Answer Save হবে

saveQuizResult({

id:
Date.now(),

topic:
question.topic,

question:
question.question,

correct,

selectedAnswer:
option,

correctAnswer:
question.answer,

date:
new Date()
.toISOString()

});






// শুধু ভুল Answer আলাদা Save হবে

if(!correct){


saveWrongMCQ({

id:
Date.now(),

topic:
question.topic,

question:
question.question,

selectedAnswer:
option,

correctAnswer:
question.answer,

date:
new Date()
.toISOString()

});


}



}







function nextQuestion(){


setSelected("");



if(current < mcqs.length - 1){


setCurrent(current + 1);


}

else{


setFinished(true);


}



}






if(finished){


return (

<div className="
rounded-xl
bg-white
p-6
shadow-sm
">


<h2 className="text-2xl font-bold">

🎉 Quiz Complete

</h2>



<p className="mt-4 text-xl">

Score:

{score}/{mcqs.length}

</p>



<p className="mt-3">

🤖 AI Coach এবং Revision Bank
আপনার Result Save করেছে।

</p>



</div>

);


}







const question =
mcqs[current];






return (

<div className="
rounded-xl
bg-white
p-6
shadow-sm
">


<h2 className="text-2xl font-bold">

📝 Question {current + 1}

</h2>




<p className="mt-5 text-lg font-semibold">

{question.question}

</p>






<div className="mt-5 space-y-3">


{


question.options.map(
(option)=>(



<button


key={option}


onClick={()=>handleAnswer(option)}


className={

`
w-full
rounded-lg
border
p-3
text-left

${
selected===option

?

option===question.answer

?

"bg-green-100 border-green-500"

:

"bg-red-100 border-red-500"


:

"hover:bg-emerald-50"

}

`

}


>



{option}



</button>



)


)



}



</div>






{

selected && (


<button


onClick={nextQuestion}


className="
mt-6
rounded-lg
bg-emerald-500
px-5
py-3
font-semibold
text-white
"


>


Next Question →


</button>


)


}





</div>


);


}
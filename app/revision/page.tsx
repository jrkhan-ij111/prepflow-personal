"use client";

import { useEffect, useState } from "react";
import RevisionQuiz from "@/components/RevisionQuiz";


export default function RevisionPage(){


const [mistakes,setMistakes] =
useState<any[]>([]);





useEffect(()=>{


const data =
localStorage.getItem(
"wrongMCQ"
);



if(data){


setMistakes(
JSON.parse(data)
);


}


},[]);






return (


<main className="
min-h-screen
bg-[#FFF8E7]
p-8
text-gray-900
">





<h1 className="text-4xl font-bold">

❌ Wrong MCQ Revision Bank

</h1>



<p className="mt-2 text-gray-600">

Review your mistakes and improve your weak areas.

</p>







{/* Revision Quiz */}


<div className="mt-8">


<RevisionQuiz />


</div>







{/* Mistake List */}


<div className="
mt-8
grid
gap-6
md:grid-cols-2
lg:grid-cols-3
">





{

mistakes.length===0

?

<div className="
rounded-xl
bg-white
p-6
shadow-sm
">


<h2 className="text-xl font-bold">

🎉 No Mistakes Yet

</h2>


<p className="mt-3">

Practice MCQ করলে ভুল প্রশ্নগুলো এখানে আসবে।

</p>


</div>





:



mistakes.map(
(item:any)=>(



<div

key={item.id}

className="
rounded-xl
bg-white
p-6
shadow-sm
"

>



<h2 className="text-xl font-bold">

📘 {item.topic}

</h2>





<div className="mt-4">


<p className="font-semibold">

❓ Question:

</p>


<p>

{item.question}

</p>


</div>






<div className="
mt-4
rounded-lg
bg-red-50
p-3
">


<p className="font-semibold text-red-600">

Your Answer ❌

</p>


<p>

{item.selectedAnswer}

</p>


</div>







<div className="
mt-3
rounded-lg
bg-green-50
p-3
">


<p className="font-semibold text-green-600">

Correct Answer ✅

</p>


<p>

{item.correctAnswer}

</p>


</div>







</div>



)


)



}




</div>






</main>


);


}
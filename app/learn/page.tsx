"use client";

import { useEffect, useState } from "react";
import { topics } from "@/data/topics";
import Link from "next/link";


export default function LearnPage(){


const [completed,setCompleted] =
useState<string[]>([]);



useEffect(()=>{


const data =
localStorage.getItem(
"lessonProgress"
);


if(data){


const records =
JSON.parse(data);



const done =
records.map(
(item:any)=>item.id
);



setCompleted(done);


}


},[]);





return (

<main className="min-h-screen bg-[#FFF8E7] p-8 text-gray-900">


<h1 className="text-4xl font-bold">
📚 Learn
</h1>


<p className="mt-2 text-gray-600">
Master BCS topics step by step.
</p>




<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">


{

topics.map((topic,index)=>{


const previous =
topics[index-1];



const unlocked =

index === 0

||

completed.includes(
previous?.id
);




const isCompleted =
completed.includes(
topic.id
);




return (


<div

key={topic.id}

className="
rounded-xl
bg-white
p-6
shadow-sm
"


>


<h2 className="text-2xl font-bold">

📖 {topic.title}

</h2>




<p className="mt-3">
<strong>Subject:</strong> {topic.subject}
</p>


<p>
<strong>Category:</strong> {topic.category}
</p>




<div className="mt-5">


<div className="h-2 rounded-full bg-gray-200">


<div

className="h-2 rounded-full bg-emerald-500"

style={{

width:
isCompleted
?
"100%"
:
"0%"

}}


/>


</div>



<p className="mt-2 text-sm">

Progress:

{
isCompleted
?
"100%"
:
"0%"
}

%

</p>



</div>





{

isCompleted && (

<p className="mt-3 font-semibold text-emerald-600">

✅ Completed

</p>

)

}





{

!unlocked && (

<p className="mt-4 font-semibold text-red-500">

🔒 Complete previous lesson first

</p>

)

}




{

unlocked && (


<Link

href={topic.path}

className="
mt-6
inline-block
rounded-lg
bg-emerald-500
px-5
py-3
font-semibold
text-white
"

>

{

isCompleted

?

"Review Lesson →"

:

"Start Learning →"

}


</Link>


)


}




</div>


);


})

}



</div>



</main>

);


}
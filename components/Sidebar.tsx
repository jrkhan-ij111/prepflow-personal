"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar(){


const pathname = usePathname();


const menu=[

{
name:"🏠 Dashboard",
path:"/"
},

{
name:"📚 Learn",
path:"/learn"
},

{
name:"📖 Library",
path:"/library"
},

{
name:"🔁 Revision Bank",
path:"/revision"
},

{
name:"🤖 AI Coach",
path:"/#aicoach"
}

];



return (

<aside
className="
fixed
left-0
top-0
h-screen
w-48
bg-white
border-r
p-4
"
>


<h1
className="
mb-8
text-2xl
font-extrabold
"
>
🚀 PrepFlow
</h1>



<nav
className="
space-y-3
"
>

{
menu.map(item=>(

<Link

key={item.name}

href={item.path}

className={`
block
rounded-xl
px-4
py-3
font-semibold

${
pathname===item.path
?
"bg-emerald-500 text-white"
:
"hover:bg-gray-100"
}

`}

>

{item.name}

</Link>

))
}


</nav>


</aside>

);

}
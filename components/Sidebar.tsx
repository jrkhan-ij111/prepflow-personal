"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar(){

const pathname = usePathname();



const menu = [

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
name:"❌ Revision Bank",
path:"/revision"
},

{
name:"🤖 AI Coach",
path:"/#aicoach"
},


];



return (

<aside className="
w-64
min-h-screen
bg-white
border-r
p-6
">


<h1 className="
text-2xl
font-bold
mb-8
">

🚀 PrepFlow

</h1>



<nav className="space-y-3">


{

menu.map((item)=>(


<Link

key={item.name}

href={item.path}

className={`
block
rounded-lg
px-4
py-3
font-semibold

${
pathname === item.path

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
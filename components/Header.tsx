export default function Header(){


return (

<header
className="
mb-8
flex
items-center
justify-between
gap-4
"
>


<div>

<h1
className="
text-4xl
font-extrabold
"
>
PrepFlow Personal
</h1>


<p
className="
mt-2
text-base
text-gray-600
"
>
Welcome back! Continue your BCS preparation journey 🚀
</p>


</div>



<div
className="
flex
items-center
gap-3
rounded-2xl
bg-gradient-to-r
from-orange-50
to-yellow-50
px-5
py-3
shadow-sm
"
>

<span className="text-2xl">
🔥
</span>


<div>

<p className="text-xs text-gray-500">
Current Streak
</p>


<p className="font-bold">
7 Days
</p>


</div>


</div>



</header>

);

}
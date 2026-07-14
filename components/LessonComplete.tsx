"use client";

import { useRouter } from "next/navigation";

export default function LessonComplete() {

  const router = useRouter();


  function completeLesson() {

    const oldProgress =
      localStorage.getItem("lessonProgress");


    const progress =
      oldProgress
      ? JSON.parse(oldProgress)
      : [];


    const lesson = {

      id: "bangla-grammar-samas",

      title: "সমাস",

      subject: "বাংলা",

      progress: 100,

      completed: true,

      date: new Date().toLocaleDateString(),

    };


    const exists =
      progress.find(
        (item:any)=>
          item.id === lesson.id
      );


    let updated;


    if(exists){

      updated =
        progress.map(
          (item:any)=>
            item.id === lesson.id
            ? lesson
            : item
        );

    }
    else{

      updated=[
        ...progress,
        lesson
      ];

    }


    localStorage.setItem(
      "lessonProgress",
      JSON.stringify(updated)
    );


    router.push("/learn");

  }



  return (

    <button

      onClick={completeLesson}

      className="
      rounded-lg
      bg-emerald-500
      px-6
      py-3
      font-semibold
      text-white
      hover:bg-emerald-600
      "

    >

      ✅ Complete Lesson

    </button>

  );

}
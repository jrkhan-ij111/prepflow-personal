export function getRecommendation(
  accuracy:number
){


  if(accuracy < 50){

    return {

      level:"Critical",

      message:
      "এই Topic আবার শুরু থেকে পড়ুন।",

      actions:[
        "📖 Lesson Revision করুন",
        "📝 20টি MCQ Practice করুন",
        "🔁 ভুল প্রশ্নগুলো আবার দেখুন"
      ]

    };

  }



  if(accuracy < 70){


    return {

      level:"Weak",

      message:
      "আরো Practice প্রয়োজন।",

      actions:[
        "📖 Short Revision করুন",
        "📝 10টি MCQ Practice করুন",
        "🔄 আগামীকাল আবার Test দিন"
      ]

    };


  }




  return {


    level:"Strong",

    message:
    "ভালো Performance।",

    actions:[
      "🏆 Advanced MCQ Practice করুন",
      "📚 নতুন Topic শুরু করুন"
    ]


  };


}
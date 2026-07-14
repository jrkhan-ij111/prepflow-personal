export function getMasteryLevel(
  accuracy:number,
  revision:number
){


  if(
    accuracy >= 80 &&
    revision >= 3
  ){

    return {

      level:"🏆 Mastered",

      color:"text-emerald-600",

      message:
      "এই Topic আপনি ভালোভাবে আয়ত্ত করেছেন।"


    };

  }




  if(
    accuracy >= 80
  ){

    return {

      level:"🟢 Strong",

      color:"text-green-600",

      message:
      "আর কিছু Revision করলে Master হবে।"


    };

  }






  if(
    accuracy >= 50
  ){

    return {

      level:"🟡 Learning",

      color:"text-yellow-600",

      message:
      "আরো Practice প্রয়োজন।"


    };

  }





  return {


    level:"🔴 Weak",

    color:"text-red-600",

    message:
    "এই Topic আবার Revision করুন।"


  };


}
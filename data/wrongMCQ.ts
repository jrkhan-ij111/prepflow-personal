export function saveWrongMCQ(data:any){


  const oldData =
    localStorage.getItem(
      "wrongMCQ"
    );



  const records =
    oldData
    ?
    JSON.parse(oldData)
    :
    [];




  records.push(data);




  localStorage.setItem(

    "wrongMCQ",

    JSON.stringify(records)

  );


}
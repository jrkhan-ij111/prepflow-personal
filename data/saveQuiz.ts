export function saveQuizResult(data:any){


  const oldData =
    localStorage.getItem(
      "mcqRecords"
    );


  const records =
    oldData
    ?
    JSON.parse(oldData)
    :
    [];



  records.push(data);



  localStorage.setItem(
    "mcqRecords",
    JSON.stringify(records)
  );


}
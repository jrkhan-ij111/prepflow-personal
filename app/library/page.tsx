"use client";

import { useState } from "react";


type Book = {
  id: number;
  title: string;
  subject: string;
  file: string;
  status: string;
};



const books: Book[] = [

  {
    id: 1,
    title: "বাংলা ব্যাকরণ (Preceptor)",
    subject: "বাংলা",
    file: "/books/bangla/grammar/Bangla_Bakoron.pdf",
    status: "Available",
  },

  {
    id: 2,
    title: "Preceptors BCS Preliminary Digest",
    subject: "সকল বিষয়",
    file: "/books/digest/Preceptors_BCS_Preliminary_Digest.pdf",
    status: "Available",
  },

  {
    id: 3,
    title: "BIBM Bank Job Solution",
    subject: "ব্যাংক",
    file: "/books/bank/BIBM_Bank_Job_Solution.pdf",
    status: "Available",
  },

  {
    id: 4,
    title: "Master English",
    subject: "ইংরেজি",
    file: "/books/english/Master_English.pdf",
    status: "Available",
  },

  {
    id: 5,
    title: "Khairul's Advanced Math",
    subject: "গণিত",
    file: "/books/math/Khairul's_Advanced_Math.pdf",
    status: "Available",
  },

  {
    id: 6,
    title: "Higher Math",
    subject: "গণিত",
    file: "/books/math/Higher_Math.pdf",
    status: "Available",
  },

  {
    id: 7,
    title: "Class Eight Math",
    subject: "গণিত",
    file: "/books/math/Class_Eight_Math.pdf",
    status: "Available",
  },

  {
    id: 8,
    title: "Science Class",
    subject: "বিজ্ঞান",
    file: "/books/science/Science_Class.pdf",
    status: "Available",
  },

  {
    id: 9,
    title: "Bangladesh General Studies (English)",
    subject: "সাধারণ জ্ঞান",
    file: "/books/gk/BGS.pdf",
    status: "Available",
  },

  {
    id: 10,
    title: "Bangladesh General Studies (Bangla)",
    subject: "সাধারণ জ্ঞান",
    file: "/books/gk/BGS_Bangla_Version.pdf",
    status: "Available",
  },

];





export default function LibraryPage() {


  const [search,setSearch] =
    useState("");



  const [subject,setSubject] =
    useState("All");



  const subjects = [
    "All",
    ...Array.from(
      new Set(
        books.map(
          book => book.subject
        )
      )
    )
  ];



  const filteredBooks =
    books.filter((book)=>{


      const matchSearch =
        book.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );



      const matchSubject =
        subject === "All"
        ||
        book.subject === subject;



      return (
        matchSearch &&
        matchSubject
      );

    });





  return (

    <main
      className="
        min-h-screen
        bg-[#FFF8E7]
        p-4
        md:p-8
        text-gray-900
      "
    >



      {/* Header */}

      <h1 className="
        text-3xl
        font-extrabold
        md:text-4xl
      ">
        📚 Knowledge Library
      </h1>


      <p className="mt-2 text-gray-600">
        All your BCS books in one place.
      </p>






      {/* Search */}

      <div className="
        mt-6
        flex
        flex-col
        gap-3
        md:flex-row
      ">


        <input
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          placeholder="Search book..."
          className="
            rounded-xl
            border
            bg-white
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-emerald-400
          "
        />



        <select
          value={subject}
          onChange={(e)=>
            setSubject(e.target.value)
          }
          className="
            rounded-xl
            border
            bg-white
            px-4
            py-3
          "
        >

          {subjects.map(item=>(

            <option key={item}>
              {item}
            </option>

          ))}

        </select>


      </div>







      {/* Books */}

      <div
        className="
          mt-8
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >



        {filteredBooks.length > 0 ? (

          filteredBooks.map((book)=>(

            <div
              key={book.id}
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
                transition
                hover:shadow-lg
              "
            >


              <h2 className="
                text-xl
                font-extrabold
              ">
                📘 {book.title}
              </h2>



              <p className="mt-3">
                <b>Subject:</b>{" "}
                {book.subject}
              </p>



              <p className="mt-2">
                <b>Status:</b>{" "}
                <span className="font-bold text-emerald-600">
                  {book.status}
                </span>
              </p>




              <a
                href={book.file}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6
                  inline-block
                  rounded-xl
                  bg-emerald-500
                  px-5
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-600
                "
              >
                📖 Open PDF
              </a>



            </div>

          ))


        ) : (


          <p className="
            rounded-xl
            bg-white
            p-6
          ">
            কোনো বই পাওয়া যায়নি।
          </p>


        )}



      </div>


    </main>

  );

}
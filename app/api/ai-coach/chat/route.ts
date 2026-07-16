import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceText, topic } = body;

    if (!sourceText || sourceText.trim().length === 0) {
      return NextResponse.json({ error: "sourceText প্রয়োজন" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); // ✅ changed model

    const topicHint = topic ? `"${topic}" টপিক থেকে` : "সোর্স থেকে র‍্যান্ডম টপিক থেকে";

    const prompt = `তুমি একটি MCQ জেনারেটর। নিচের সোর্স টেক্সট থেকে ${topicHint} একটি নতুন MCQ প্রশ্ন তৈরি করো।

গুরুত্বপূর্ণ:
- প্রতিবার আলাদা টপিক থেকে প্রশ্ন দাও
- প্রশ্ন যেন আগের প্রশ্নের পুনরাবৃত্তি না হয়

ফরম্যাট:
<<<QUESTION>>>
{
  "question": "প্রশ্নটি বাংলায়",
  "options": ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],
  "correctIndex": 0,
  "explanation": "উত্তর সঠিক হলে: কেন সঠিক, উত্তরের ব্যাখ্যা। উত্তর ভুল হলে: কেন ভুল, সঠিক উত্তর কী এবং কেন সেটা সঠিক - বিস্তারিত ব্যাখ্যা বাংলায়।",
  "topic": "টপিকের নাম"
}
<<<END>>>

সোর্স টেক্সট:
${sourceText}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "MCQ জেনারেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
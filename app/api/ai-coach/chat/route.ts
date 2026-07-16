import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceText, topic } = body;

    if (!sourceText || sourceText.trim().length === 0) {
      return NextResponse.json({ error: "sourceText প্রয়োজন" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const topicHint = topic
      ? `"${topic}" টপিক থেকে`
      : "সোর্স থেকে র‍্যান্ডম টপিক থেকে";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `তুমি একটি MCQ জেনারেটর। নিচের সোর্স টেক্সট থেকে ${topicHint} একটি নতুন MCQ প্রশ্ন তৈরি করো।

ফরম্যাট:
<<<QUESTION>>>
{
  "question": "প্রশ্নটি বাংলায়",
  "options": ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],
  "correctIndex": 0,
  "explanation": "উত্তরের ব্যাখ্যা বাংলায়",
  "topic": "টপিকের নাম"
}
<<<END>>>
`
        },
        {
          role: "user",
          content: `সোর্স টেক্সট:\n${sourceText}`
        }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI Chat API error:", error);
    return NextResponse.json(
      { error: "MCQ জেনারেট করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
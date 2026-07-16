import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceText, topic } = body;

    if (!sourceText?.trim()) {
      return NextResponse.json({ error: "sourceText প্রয়োজন" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DEEPSEEK_API_KEY missing" }, { status: 500 });
    }

    const topicHint = topic
      ? `"${topic}" টপিক থেকে`
      : "সোর্স থেকে র‍্যান্ডম টপিক থেকে";

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
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
`,
          },
          {
            role: "user",
            content: `সোর্স টেক্সট:\n${sourceText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || "DeepSeek API error");
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("DeepSeek API error:", error);
    return NextResponse.json(
      { error: "MCQ জেনারেট করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
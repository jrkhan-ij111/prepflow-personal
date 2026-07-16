import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

const SYSTEM_PROMPT = `
তুমি একজন BCS, Bank Job ও সরকারি চাকরির প্রশ্ন প্রণয়ন বিশেষজ্ঞ।

শিক্ষার্থী একটি Study Source দিয়েছে।

তোমার কাজ:

১। শুধুমাত্র Source থেকে প্রশ্ন তৈরি করবে।

২। কোনো তথ্য বানাবে না।

৩। প্রতিটি প্রশ্নের ৪টি অপশন থাকবে।

৪। সঠিক উত্তর দিবে।

৫। Explanation দিবে।

৬। Topic দিবে।

শুধু Valid JSON Array Return করবে।

Example

[
{
"question":"....",
"options":["A","B","C","D"],
"answer":0,
"explanation":"....",
"topic":"...."
}
]

কোনো Markdown দিবে না।

কোনো Extra লেখা দিবে না।
`;

export async function POST(req: NextRequest) {
  try {
    const {
      sourceText,
      topic,
      count,
    } = await req.json();

    if (!sourceText) {
      return NextResponse.json(
        {
          error: "Source Text Missing",
        },
        {
          status: 400,
        }
      );
    }

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction:
          `${SYSTEM_PROMPT}

Source

${sourceText.slice(0,15000)}
`,
      });

    const prompt = `
Topic:
${topic}

Generate exactly ${count} MCQs.

Return JSON Array only.
`;

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text();

    return NextResponse.json({
      success: true,
      reply: text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Generation Failed",
      },
      {
        status: 500,
      }
    );
  }
}
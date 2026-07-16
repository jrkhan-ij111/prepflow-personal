import Anthropic from "@anthropic-ai/sdk";

// Keep your API key on the server only — never expose it in client code.
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { system, content } = await req.json();

    if (!content || typeof content !== "string") {
      return Response.json({ error: "Missing 'content' in request body" }, { status: 400 });
    }

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system:
        system ||
        `You are an expert Bangladeshi BCS/Bank exam question setter. Given study content, generate multiple choice questions in BANGLA (Bengali) suitable for BCS/Bank preparation.
Return ONLY valid JSON, no markdown fences, no preamble, in exactly this shape:
{"questions":[{"topic":"short topic name in Bangla (2-4 words)","question":"question text in Bangla","options":["option ক","option খ","option গ","option ঘ"],"correctIndex":0,"explanation":"short explanation in Bangla, 1-2 sentences"}]}
Generate 6 questions. Base every question strictly on the given content. Vary topics if the content covers multiple sub-topics. Keep explanations concise.`,
      messages: [
        {
          role: "user",
          content: `Study content:\n\n${content.slice(0, 9000)}`,
        },
      ],
    });

    const text = msg.content
      .map((b: any) => (b.type === "text" ? b.text : ""))
      .join("")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: { questions?: unknown[] };
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Claude response as JSON:", text);
      return Response.json(
        { error: "AI response could not be parsed. Try again." },
        { status: 502 }
      );
    }

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return Response.json({ error: "No questions were generated." }, { status: 502 });
    }

    return Response.json(parsed);
  } catch (err: any) {
    console.error("generate-mcq error:", err);
    return Response.json(
      { error: err?.message || "Something went wrong generating questions." },
      { status: 500 }
    );
  }
}
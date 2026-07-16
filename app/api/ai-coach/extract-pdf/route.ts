import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "ফাইল দেওয়া হয়নি" }, { status: 400 });
    }

    const pdfParseModule = await import("pdf-parse");
    const pdfParse = (pdfParseModule as any).default || pdfParseModule;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);

    return NextResponse.json({
      text: data.text,
      fileName: file.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "PDF প্রসেস করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
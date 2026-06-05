import { NextRequest, NextResponse } from "next/server";

import mammoth from "mammoth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    const mimeType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".txt") || mimeType === "text/plain") {
      text = buffer.toString("utf-8");
    } else if (fileName.endsWith(".pdf") || mimeType === "application/pdf") {
      try {
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } catch (err) {
        throw new Error("Failed to parse PDF document. It might be corrupted or encrypted.");
      }
    } else if (
      fileName.endsWith(".docx") ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (err) {
        throw new Error("Failed to parse DOCX document.");
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload TXT, PDF, or DOCX files." },
        { status: 400 }
      );
    }

    // Clean up extracted text (remove excessive newlines and whitespace)
    text = text.replace(/\r\n/g, "\n");
    text = text.replace(/\n{3,}/g, "\n\n");
    text = text.trim();

    if (text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract sufficient text from this file for analysis (minimum 50 characters required)." },
        { status: 400 }
      );
    }

    // Limit to a reasonable size to prevent abuse (e.g. 100k chars)
    if (text.length > 100000) {
      text = text.substring(0, 100000);
    }

    return NextResponse.json({ text, charCount: text.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to extract text from file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function extractPdfText(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

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
        text = await extractPdfText(buffer);
      } catch (err) {
        const message = err instanceof Error ? err.message : "";

        if (message.toLowerCase().includes("password")) {
          throw new Error("This PDF is password protected. Please upload an unlocked PDF, DOCX, or TXT file.");
        }

        throw new Error("Failed to read text from this PDF. Please try a text-based PDF, DOCX, or TXT file.");
      }
    } else if (
      fileName.endsWith(".docx") ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        text = await extractDocxText(buffer);
      } catch {
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

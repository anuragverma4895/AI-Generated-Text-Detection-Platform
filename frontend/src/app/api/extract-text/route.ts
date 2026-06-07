import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

class FileExtractionError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = "FileExtractionError";
  }
}

function normalizeExtractedText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdfText(buffer: Buffer) {
  const errors: string[] = [];

  try {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default;
    const result = await pdfParse(buffer);
    const text = normalizeExtractedText(result.text || "");
    if (text.length >= 50) return text;
    errors.push("pdf-parse returned too little text");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "pdf-parse failed");
  }

  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      disableFontFace: true,
      isEvalSupported: false,
      useWorkerFetch: false,
    });
    const pdf = await loadingTask.promise;
    const pages: string[] = [];

    try {
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .filter(Boolean)
          .join(" ");
        pages.push(pageText);
        page.cleanup();
      }
    } finally {
      await pdf.destroy();
    }

    const text = normalizeExtractedText(pages.join("\n\n"));
    if (text.length >= 50) return text;
    errors.push("PDF.js returned too little text");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "PDF.js fallback failed");
  }

  const diagnostic = errors.join(" | ").toLowerCase();

  if (diagnostic.includes("password") || diagnostic.includes("encrypted")) {
    throw new FileExtractionError("This PDF is password protected. Please upload an unlocked PDF, DOCX, or TXT file.");
  }

  throw new FileExtractionError(
    "Could not extract readable text from this PDF. If it is a scanned/image-only PDF, convert it with OCR first or upload a DOCX/TXT version."
  );
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
      text = await extractPdfText(buffer);
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

    text = normalizeExtractedText(text);

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
    const status = error instanceof FileExtractionError ? error.status : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function stripHtml(html: string): string {
  // Remove script and style tags with their content
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");

  // Replace block-level elements with newlines
  text = text.replace(/<\/?(p|div|br|h[1-6]|li|tr|blockquote|section|article)[^>]*>/gi, "\n");

  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#039;/g, "'");
  text = text.replace(/&nbsp;/g, " ");

  // Collapse whitespace
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid URL is required" },
        { status: 400 }
      );
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP/HTTPS URLs are supported");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL. Please enter a valid http:// or https:// URL." },
        { status: 400 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (HTTP ${response.status})` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const plainText = stripHtml(html);

    if (plainText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from this URL." },
        { status: 400 }
      );
    }

    // Limit text to ~50k chars to avoid overload
    const trimmedText = plainText.slice(0, 50000);

    return NextResponse.json({
      text: trimmedText,
      url: parsedUrl.toString(),
      charCount: trimmedText.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch URL content";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

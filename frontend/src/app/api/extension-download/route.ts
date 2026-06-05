import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_ZIP_URL =
  "https://github.com/anuragverma4895/AI-generated-text-detection/archive/refs/heads/main.zip";

export async function GET() {
  try {
    const upstream = await fetch(GITHUB_ZIP_URL, { redirect: "follow" });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch extension archive from GitHub" },
        { status: upstream.status }
      );
    }

    const blob = await upstream.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="TruthLens-AI-Extension.zip"',
        "Content-Length": String(blob.size),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown download error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

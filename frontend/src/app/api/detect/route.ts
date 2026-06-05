import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBackendApiBaseUrl() {
  const configuredUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.BACKEND_HOSTPORT) {
    return `http://${process.env.BACKEND_HOSTPORT}/api/v1`;
  }

  return "http://localhost:8000/api/v1";
}

async function readBackendResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return {
    detail: text.trim() || `Detection backend returned status ${response.status}`,
    error: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${getBackendApiBaseUrl()}/detection/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await readBackendResponse(response);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unable to reach detection backend";
    return NextResponse.json({ detail, error: true }, { status: 502 });
  }
}

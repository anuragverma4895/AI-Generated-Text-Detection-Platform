/* Text cleaning, kept client-side for fast validation before calling the API. */
export function cleanText(text: string): string {
  let t = text;
  t = t.replace(/<<.*?>>/g, "");
  t = t.replace(/\s+([?.!,;:])/g, "$1");
  t = t.replace(/#{1,6}\s*/g, " ");
  t = t.replace(/```/g, "");
  t = t.replace(/`/g, "").replace(/\*\*/g, "").replace(/__/g, "");
  t = t.replace(/\\\[/g, "").replace(/\\\]/g, "").replace(/\\\(/g, "").replace(/\\\)/g, "");
  t = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  t = t.replace(/[ \t]+/g, " ");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.trim();
  t = t.replace(/URL_\d+/g, "");
  return t;
}

export interface SentenceDetail {
  text: string;
  probability: number;
}

export interface AnalysisResult {
  probability: number;
  label: string;
  segments: number;
  segmentDetails: SentenceDetail[];
  sentenceDetails: SentenceDetail[];
  error?: boolean;
}

export type ProgressCallback = (message: string, progress: number) => void;

async function detectWithBackend(text: string): Promise<AnalysisResult> {
  const response = await fetch("/api/detect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    const detail = typeof data?.detail === "string" ? data.detail : "Detection request failed";
    throw new Error(detail);
  }

  return data as AnalysisResult;
}

export async function analyzeText(
  rawText: string,
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  try {
    onProgress?.("Cleaning text...", 10);
    const text = cleanText(rawText);

    if (!text || text.trim().length < 150) {
      return {
        probability: 0,
        label: "Text too short (Need 150+ chars)",
        segments: 0,
        segmentDetails: [],
        sentenceDetails: [],
      };
    }

    onProgress?.("Sending text to detector...", 35);
    const result = await detectWithBackend(text);
    onProgress?.("Complete!", 100);

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      probability: 0,
      label: "Error: " + message,
      segments: 0,
      segmentDetails: [],
      sentenceDetails: [],
      error: true,
    };
  }
}

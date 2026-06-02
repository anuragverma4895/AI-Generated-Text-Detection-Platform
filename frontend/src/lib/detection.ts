import { HF_API_URL, TRANSLATE_API } from "./constants";

/* ── Text cleaning (ported from extension background.js) ── */
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

/* ── Language detection ── */
export function isLikelyEnglish(text: string): boolean {
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  const allAlpha = (text.match(/\p{L}/gu) || []).length;
  if (allAlpha === 0) return true;
  return latinChars / allAlpha > 0.7;
}

/* ── Segment text into chunks ── */
export function segmentText(text: string, maxChars: number = 1500): string[] {
  if (text.length <= maxChars) return [text];

  const segments: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).length > maxChars && current.length > 0) {
      segments.push(current.trim());
      current = sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }

  if (current.trim().length > 0) {
    segments.push(current.trim());
  }

  const finalSegments: string[] = [];
  for (const seg of segments) {
    if (seg.length <= maxChars) {
      finalSegments.push(seg);
    } else {
      const words = seg.split(/\s+/);
      let chunk = "";
      for (const word of words) {
        if ((chunk + " " + word).length > maxChars && chunk.length > 0) {
          finalSegments.push(chunk.trim());
          chunk = word;
        } else {
          chunk += (chunk ? " " : "") + word;
        }
      }
      if (chunk.trim().length > 0) {
        finalSegments.push(chunk.trim());
      }
    }
  }

  return finalSegments;
}

/* ── Softmax ── */
function softmax(logits: number[]): number {
  const maxLogit = Math.max(...logits);
  const scaledLogits = logits.map((l) => Math.exp(l - maxLogit));
  const sum = scaledLogits.reduce((a, b) => a + b, 0);
  const probs = scaledLogits.map((l) => l / sum);
  return probs[1]; // Index 1 = AI class
}

/* ── HuggingFace API call ── */
async function predict(text: string): Promise<{ logits: number[] }> {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const logits = Array.isArray(data[0]) ? data[0] : data;
  return { logits };
}

/* ── Translate text ── */
async function translate(
  text: string
): Promise<{ translated: string; detectedLang: string }> {
  const url = `${TRANSLATE_API}?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Translation API Error ${response.status}`);
  }

  const data = await response.json();
  const translated = data[0].map((item: string[]) => item[0]).join("");
  const detectedLang = data[2] || "unknown";
  return { translated, detectedLang };
}

/* ── Sentence detail type ── */
export interface SentenceDetail {
  text: string;
  probability: number;
}

/* ── Full analysis result ── */
export interface AnalysisResult {
  probability: number;
  label: string;
  segments: number;
  segmentDetails: SentenceDetail[];
  sentenceDetails: SentenceDetail[];
  error?: boolean;
}

/* ── Progress callback ── */
export type ProgressCallback = (message: string, progress: number) => void;

/* ── Full analysis pipeline (ported from background.js) ── */
export async function analyzeText(
  rawText: string,
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  try {
    onProgress?.("Cleaning text...", 5);
    let text = cleanText(rawText);

    if (!text || text.trim().length < 150) {
      return {
        probability: 0,
        label: "Text too short (Need 150+ chars)",
        segments: 0,
        segmentDetails: [],
        sentenceDetails: [],
      };
    }

    onProgress?.("Detecting language...", 10);
    if (!isLikelyEnglish(text)) {
      onProgress?.("Translating to English...", 15);
      const { translated } = await translate(text);
      text = translated;
    }

    onProgress?.("Segmenting text...", 20);
    const segments = segmentText(text, 1500);

    const results: { prob: number; length: number }[] = [];
    const segmentDetails: SentenceDetail[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment.trim().length < 10) continue;

      const progress = 20 + ((i + 1) / segments.length) * 60;
      onProgress?.(
        `Analyzing segment ${i + 1} of ${segments.length}...`,
        progress
      );

      try {
        const { logits } = await predict(segment);
        const prob = softmax(logits);
        results.push({ prob, length: segment.length });
        segmentDetails.push({ text: segment, probability: prob * 100 });
      } catch {
        segmentDetails.push({ text: segment, probability: -1 });
      }
    }

    if (results.length === 0) {
      return {
        probability: 0,
        label: "Analysis failed",
        segments: 0,
        segmentDetails: [],
        sentenceDetails: [],
      };
    }

    onProgress?.("Computing results...", 90);

    const totalLen = results.reduce((sum, r) => sum + r.length, 0);
    const weightedProb =
      results.reduce((sum, r) => sum + r.prob * r.length, 0) / totalLen;

    const probability = weightedProb * 100;
    let label: string;
    if (probability > 75) label = "Likely AI-Generated";
    else if (probability > 50) label = "Possibly AI-Generated";
    else if (probability > 30) label = "Mixed / Uncertain";
    else label = "Likely Human-Written";

    const sentenceDetails: SentenceDetail[] = [];
    for (const seg of segmentDetails) {
      if (seg.probability < 0) continue;
      const sentences = seg.text.split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        if (sentence.trim().length > 0) {
          sentenceDetails.push({
            text: sentence.trim(),
            probability: seg.probability,
          });
        }
      }
    }

    onProgress?.("Complete!", 100);

    return { probability, label, segments: results.length, segmentDetails, sentenceDetails };
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

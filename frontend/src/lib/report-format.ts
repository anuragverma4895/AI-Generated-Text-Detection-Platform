import type { SentenceDetail } from "./detection";

export interface ReportTextPart {
  text: string;
  probability: number | null;
}

function normalizeSentence(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([?.!,;:])/g, "$1")
    .trim()
    .toLowerCase();
}

function createProbabilityMap(sentenceDetails: SentenceDetail[]) {
  const map = new Map<string, number>();

  for (const sentence of sentenceDetails) {
    const key = normalizeSentence(sentence.text);
    if (key) map.set(key, sentence.probability);
  }

  return map;
}

export function splitTextWithSentenceScores(
  inputText: string,
  sentenceDetails: SentenceDetail[]
): ReportTextPart[] {
  const probabilities = createProbabilityMap(sentenceDetails);
  const parts: ReportTextPart[] = [];
  const sentencePattern = /[^.!?\n]+[.!?]+(?:["')\]]+)?|[^.!?\n]+|\n+/g;
  const matches = inputText.match(sentencePattern);

  if (!matches) {
    return [{ text: inputText, probability: null }];
  }

  for (const part of matches) {
    if (/^\n+$/.test(part)) {
      parts.push({ text: part, probability: null });
      continue;
    }

    const key = normalizeSentence(part);
    parts.push({
      text: part,
      probability: probabilities.get(key) ?? null,
    });
  }

  return parts;
}

export function getScoreClass(probability: number | null) {
  if (probability === null) return "report-human";
  if (probability > 75) return "report-ai-high";
  if (probability > 50) return "report-ai-medium";
  if (probability > 30) return "report-ai-low";
  return "report-human";
}

export function getScoreLabel(probability: number | null) {
  if (probability === null) return "";
  return `${probability.toFixed(0)}% AI`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

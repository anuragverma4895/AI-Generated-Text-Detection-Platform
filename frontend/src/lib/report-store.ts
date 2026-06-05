import type { AnalysisResult } from "./detection";

export interface SavedReport {
  id: string;
  date: string;
  source: string;
  score: number;
  verdict: string;
  wordCount: number;
  charCount: number;
  result: AnalysisResult;
  inputText: string;
}

const STORAGE_KEY = "truthlens_reports";

function generateId(): string {
  return `REP-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function getReports(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedReport[];
  } catch {
    return [];
  }
}

export function saveReport(
  result: AnalysisResult,
  inputText: string,
  source: string = "Pasted Text"
): SavedReport {
  const reports = getReports();

  const report: SavedReport = {
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
    source,
    score: Math.round(result.probability * 10) / 10,
    verdict: result.label,
    wordCount: inputText.split(/\s+/).filter(Boolean).length,
    charCount: inputText.length,
    result,
    inputText,
  };

  reports.unshift(report);

  // Keep max 50 reports
  if (reports.length > 50) reports.length = 50;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return report;
}

export function deleteReport(id: string): void {
  const reports = getReports().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function clearReports(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportReportAsJson(report: SavedReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.id}-report.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportReportAsCsv(report: SavedReport): void {
  const rows = [
    ["Sentence", "AI Probability (%)"],
    ...report.result.sentenceDetails.map((s) => [
      `"${s.text.replace(/"/g, '""')}"`,
      s.probability.toFixed(1),
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.id}-sentences.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

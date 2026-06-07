import type { AnalysisResult } from "./detection";
import {
  escapeHtml,
  getScoreClass,
  getScoreLabel,
  splitTextWithSentenceScores,
} from "./report-format";

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

export function exportReportAsPdf(report: SavedReport): void {
  const printable = window.open("", "_blank", "width=1100,height=800");
  if (!printable) return;

  const highlightedText = splitTextWithSentenceScores(
    report.inputText,
    report.result.sentenceDetails || []
  )
    .map((part) => {
      const label = getScoreLabel(part.probability);
      const title = label ? ` title="${escapeHtml(label)}"` : "";
      return `<span class="${getScoreClass(part.probability)}"${title}>${escapeHtml(part.text)}</span>`;
    })
    .join("");

  printable.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(report.id)} Report</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #f8fafc;
        color: #0f172a;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.55;
      }
      .page {
        width: min(960px, calc(100% - 48px));
        margin: 32px auto;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 32px;
      }
      h1 { margin: 0 0 8px; font-size: 28px; }
      .muted { color: #64748b; }
      .summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin: 24px 0;
      }
      .metric {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        background: #f8fafc;
      }
      .metric strong {
        display: block;
        font-size: 20px;
        margin-bottom: 4px;
      }
      .section-title {
        font-size: 16px;
        margin: 24px 0 12px;
      }
      .document-text {
        white-space: pre-wrap;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 18px;
        font-size: 13px;
        background: #ffffff;
      }
      .report-ai-high { background: #fee2e2; color: #991b1b; }
      .report-ai-medium { background: #fef3c7; color: #92400e; }
      .report-ai-low { background: #fef9c3; color: #854d0e; }
      .report-human { color: #334155; }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        font-size: 12px;
        margin-bottom: 12px;
      }
      .legend span {
        border: 1px solid #e2e8f0;
        border-radius: 999px;
        padding: 5px 9px;
      }
      @media print {
        body { background: #ffffff; }
        .page {
          width: 100%;
          margin: 0;
          border: 0;
          border-radius: 0;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <h1>TruthLens AI Report</h1>
      <div class="muted">Report ID: ${escapeHtml(report.id)} | Date: ${escapeHtml(report.date)} | Source: ${escapeHtml(report.source)}</div>

      <section class="summary">
        <div class="metric"><strong>${report.score}%</strong><span>AI Score</span></div>
        <div class="metric"><strong>${escapeHtml(report.verdict)}</strong><span>Verdict</span></div>
        <div class="metric"><strong>${report.wordCount.toLocaleString()}</strong><span>Words</span></div>
        <div class="metric"><strong>${report.charCount.toLocaleString()}</strong><span>Characters</span></div>
      </section>

      <h2 class="section-title">Extracted Text With Sentence Scores</h2>
      <div class="legend">
        <span class="report-ai-high">AI Likely (&gt;75%)</span>
        <span class="report-ai-medium">AI Possible (50-75%)</span>
        <span class="report-ai-low">Uncertain (30-50%)</span>
        <span class="report-human">Human (&lt;30%)</span>
      </div>
      <section class="document-text">${highlightedText}</section>
    </main>
    <script>
      window.onload = function () {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`);
  printable.document.close();
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

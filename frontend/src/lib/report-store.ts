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

function getReportTone(score: number) {
  if (score > 75) {
    return {
      name: "High AI Risk",
      className: "tone-high",
      accent: "#ef4444",
      soft: "#fee2e2",
    };
  }
  if (score > 50) {
    return {
      name: "Moderate AI Risk",
      className: "tone-medium",
      accent: "#f59e0b",
      soft: "#fef3c7",
    };
  }
  if (score > 30) {
    return {
      name: "Mixed / Needs Review",
      className: "tone-low",
      accent: "#eab308",
      soft: "#fef9c3",
    };
  }
  return {
    name: "Low AI Risk",
    className: "tone-human",
    accent: "#10b981",
    soft: "#d1fae5",
  };
}

function getTopSentenceRows(report: SavedReport) {
  return (report.result.sentenceDetails || [])
    .slice()
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 12)
    .map((sentence, index) => {
      const tone = getReportTone(sentence.probability);
      return `<tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(sentence.text)}</td>
        <td>
          <div class="score-pill ${tone.className}">${sentence.probability.toFixed(1)}%</div>
        </td>
      </tr>`;
    })
    .join("");
}

export function exportReportAsPdf(report: SavedReport): void {
  const printable = window.open("", "_blank", "width=1100,height=800");
  if (!printable) return;

  const aiScore = Math.max(0, Math.min(100, report.score));
  const humanScore = Math.max(0, 100 - aiScore);
  const tone = getReportTone(aiScore);
  const sentenceRows = getTopSentenceRows(report);
  const sentenceCount = report.result.sentenceDetails?.length || 0;
  const generatedAt = new Date().toLocaleString();

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
      @page { margin: 18mm; }
      body {
        margin: 0;
        background:
          radial-gradient(circle at 12% 8%, rgba(20, 184, 166, 0.18), transparent 28%),
          radial-gradient(circle at 88% 10%, rgba(239, 68, 68, 0.14), transparent 26%),
          linear-gradient(180deg, #f8fafc 0%, #eef2ff 52%, #f7fee7 100%);
        color: #111827;
        font-family: Inter, Arial, Helvetica, sans-serif;
        line-height: 1.55;
      }
      .page {
        width: min(1040px, calc(100% - 40px));
        margin: 28px auto;
        background: #ffffff;
        border: 1px solid rgba(148, 163, 184, 0.28);
        border-radius: 22px;
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.16);
      }
      .hero {
        color: #ffffff;
        padding: 34px;
        background:
          linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(127, 29, 29, 0.94) 42%, rgba(13, 148, 136, 0.94) 100%),
          radial-gradient(circle at 82% 26%, rgba(250, 204, 21, 0.38), transparent 24%);
      }
      .hero-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 18px;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: linear-gradient(135deg, #22c55e, #06b6d4 45%, #f97316);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.46);
      }
      h1 {
        margin: 0 0 10px;
        font-size: 34px;
        letter-spacing: 0;
        line-height: 1.08;
      }
      .hero-subtitle {
        max-width: 620px;
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
        font-size: 14px;
      }
      .score-panel {
        min-width: 230px;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 18px;
        padding: 18px;
        background: rgba(255, 255, 255, 0.13);
      }
      .score-label {
        margin-bottom: 4px;
        color: rgba(255, 255, 255, 0.72);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .score-number {
        font-size: 46px;
        font-weight: 900;
        line-height: 1;
      }
      .score-number span { font-size: 22px; }
      .verdict-badge {
        display: inline-flex;
        margin-top: 12px;
        border-radius: 999px;
        padding: 7px 11px;
        background: rgba(255, 255, 255, 0.16);
        font-size: 12px;
        font-weight: 800;
      }
      .content { padding: 30px 34px 34px; }
      .report-meta {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: -48px;
        margin-bottom: 24px;
      }
      .meta-card,
      .metric {
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 14px;
        background: #ffffff;
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
      }
      .meta-card small,
      .metric span {
        display: block;
        color: #64748b;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .meta-card strong,
      .metric strong {
        display: block;
        margin-top: 6px;
        color: #0f172a;
        font-size: 15px;
        word-break: break-word;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin: 24px 0;
      }
      .metric {
        position: relative;
        overflow: hidden;
      }
      .metric::before {
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: 4px;
        background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #06b6d4);
      }
      .metric strong { font-size: 23px; }
      .breakdown {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 18px;
        margin: 26px 0;
      }
      .panel {
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 18px;
        background: linear-gradient(180deg, #ffffff, #f8fafc);
      }
      .section-title {
        margin: 0 0 12px;
        color: #0f172a;
        font-size: 17px;
        letter-spacing: 0;
      }
      .bar-row { margin-top: 16px; }
      .bar-head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 7px;
        font-size: 12px;
        font-weight: 800;
      }
      .track {
        height: 12px;
        border-radius: 999px;
        overflow: hidden;
        background: #e5e7eb;
      }
      .fill-ai {
        height: 100%;
        width: ${aiScore}%;
        background: linear-gradient(90deg, #ef4444, #f97316);
      }
      .fill-human {
        height: 100%;
        width: ${humanScore}%;
        background: linear-gradient(90deg, #10b981, #06b6d4);
      }
      .risk-card {
        border-color: ${tone.accent};
        background: linear-gradient(135deg, ${tone.soft}, #ffffff 70%);
      }
      .risk-name {
        color: ${tone.accent};
        font-size: 22px;
        font-weight: 900;
      }
      .risk-note {
        margin: 8px 0 0;
        color: #475569;
        font-size: 13px;
      }
      .document-text {
        white-space: pre-wrap;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 20px;
        font-size: 13px;
        background:
          linear-gradient(90deg, rgba(248, 250, 252, 0.88), rgba(255, 255, 255, 0.96)),
          repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(148, 163, 184, 0.09) 28px);
        box-shadow: inset 0 1px 0 #ffffff;
      }
      .report-ai-high { background: #fee2e2; color: #991b1b; border-bottom: 2px solid #ef4444; }
      .report-ai-medium { background: #fef3c7; color: #92400e; border-bottom: 2px solid #f59e0b; }
      .report-ai-low { background: #fef9c3; color: #854d0e; border-bottom: 2px solid #eab308; }
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
        padding: 6px 10px;
        font-weight: 800;
      }
      .sentence-table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
        border-radius: 14px;
        font-size: 12px;
      }
      .sentence-table th {
        background: #0f172a;
        color: #ffffff;
        padding: 10px;
        text-align: left;
      }
      .sentence-table td {
        border-bottom: 1px solid #e2e8f0;
        padding: 10px;
        vertical-align: top;
      }
      .sentence-table tr:nth-child(even) td { background: #f8fafc; }
      .score-pill {
        display: inline-flex;
        min-width: 66px;
        justify-content: center;
        border-radius: 999px;
        padding: 5px 8px;
        font-weight: 900;
      }
      .tone-high { color: #991b1b; background: #fee2e2; }
      .tone-medium { color: #92400e; background: #fef3c7; }
      .tone-low { color: #854d0e; background: #fef9c3; }
      .tone-human { color: #065f46; background: #d1fae5; }
      .footer-note {
        margin-top: 26px;
        border-top: 1px solid #e2e8f0;
        padding-top: 14px;
        color: #64748b;
        font-size: 11px;
      }
      @media print {
        body { background: #ffffff; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .page {
          width: 100%;
          margin: 0;
          border: 0;
          border-radius: 0;
          box-shadow: none;
        }
        .content { padding: 24px 0 0; }
        .report-meta { margin-top: -36px; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <div class="hero-top">
          <div>
            <div class="brand"><span class="brand-mark"></span>TruthLens AI</div>
            <h1>Authenticity Analysis Report</h1>
            <p class="hero-subtitle">A detailed AI-generated text detection report with preserved extracted formatting, visual scoring, and sentence-level evidence.</p>
          </div>
          <aside class="score-panel">
            <div class="score-label">AI Probability</div>
            <div class="score-number">${aiScore.toFixed(1)}<span>%</span></div>
            <div class="verdict-badge">${escapeHtml(report.verdict)}</div>
          </aside>
        </div>
      </section>

      <section class="content">
        <section class="report-meta">
          <div class="meta-card"><small>Report ID</small><strong>${escapeHtml(report.id)}</strong></div>
          <div class="meta-card"><small>Date</small><strong>${escapeHtml(report.date)}</strong></div>
          <div class="meta-card"><small>Source</small><strong>${escapeHtml(report.source)}</strong></div>
        </section>

        <section class="summary">
          <div class="metric"><span>AI Score</span><strong>${aiScore.toFixed(1)}%</strong></div>
          <div class="metric"><span>Segments</span><strong>${report.result.segments.toLocaleString()}</strong></div>
          <div class="metric"><span>Words</span><strong>${report.wordCount.toLocaleString()}</strong></div>
          <div class="metric"><span>Characters</span><strong>${report.charCount.toLocaleString()}</strong></div>
        </section>

        <section class="breakdown">
          <div class="panel">
            <h2 class="section-title">Probability Breakdown</h2>
            <div class="bar-row">
              <div class="bar-head"><span style="color:#dc2626">AI-Generated</span><span>${aiScore.toFixed(1)}%</span></div>
              <div class="track"><div class="fill-ai"></div></div>
            </div>
            <div class="bar-row">
              <div class="bar-head"><span style="color:#059669">Human-Written</span><span>${humanScore.toFixed(1)}%</span></div>
              <div class="track"><div class="fill-human"></div></div>
            </div>
          </div>
          <div class="panel risk-card">
            <h2 class="section-title">Final Verdict</h2>
            <div class="risk-name">${escapeHtml(tone.name)}</div>
            <p class="risk-note">${escapeHtml(report.verdict)} based on ${sentenceCount.toLocaleString()} sentence scores and ${report.result.segments.toLocaleString()} analyzed segment(s).</p>
          </div>
        </section>

        <section class="panel">
          <h2 class="section-title">Most AI-Likely Sentences</h2>
          <table class="sentence-table">
            <thead>
              <tr><th>#</th><th>Sentence</th><th>AI Score</th></tr>
            </thead>
            <tbody>
              ${sentenceRows || `<tr><td colspan="3">No sentence-level scores were available.</td></tr>`}
            </tbody>
          </table>
        </section>

        <section style="margin-top: 24px;">
          <h2 class="section-title">Extracted Text With Highlights</h2>
          <div class="legend">
            <span class="report-ai-high">AI Likely (&gt;75%)</span>
            <span class="report-ai-medium">AI Possible (50-75%)</span>
            <span class="report-ai-low">Uncertain (30-50%)</span>
            <span class="report-human">Human (&lt;30%)</span>
          </div>
          <section class="document-text">${highlightedText}</section>
        </section>

        <div class="footer-note">Generated on ${escapeHtml(generatedAt)}. This report is a probabilistic writing analysis and should be reviewed with source context.</div>
      </section>
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

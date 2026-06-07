"use client";

import { useState } from "react";
import { Download, FileText, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  getReports,
  deleteReport,
  clearReports,
  exportReportAsPdf,
  exportReportAsJson,
  type SavedReport,
} from "@/lib/report-store";

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>(() => getReports());
  const [search, setSearch] = useState("");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
      setReports(getReports());
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to delete all reports?")) {
      clearReports();
      setReports([]);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.source.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="section-container py-12 flex-1">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports Archive</h1>
          <p className="text-muted-foreground">View and download your historical analysis reports.</p>
        </div>
        <Link href="/dashboard" className="btn-primary w-fit">
          <FileText className="w-4 h-4 mr-2" /> New Analysis
        </Link>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by ID or source name..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={handleClear} disabled={reports.length === 0} className="btn-secondary py-2 text-red-400 hover:text-red-300 hover:border-red-500/50">
            <Trash2 className="w-4 h-4 mr-2" /> Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-y border-border/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Report ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Source</th>
                <th className="p-4 font-medium">AI Score</th>
                <th className="p-4 font-medium">Verdict</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No reports found. Run an analysis in the Dashboard to see it here.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-xs">{report.id}</td>
                    <td className="p-4 text-muted-foreground">{report.date}</td>
                    <td className="p-4 font-medium max-w-xs truncate" title={report.source}>{report.source}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        report.score > 75 ? "bg-red-500/10 text-red-500" :
                        report.score > 50 ? "bg-amber-500/10 text-amber-500" :
                        report.score > 30 ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-emerald-500/10 text-emerald-500"
                      }`}>
                        {report.score}%
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{report.verdict}</td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => exportReportAsPdf(report)} className="p-2 hover:bg-primary/20 hover:text-primary rounded transition-colors" title="Export PDF">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button onClick={() => exportReportAsJson(report)} className="p-2 hover:bg-primary/20 hover:text-primary rounded transition-colors" title="Download JSON">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(report.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors" title="Delete Report">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

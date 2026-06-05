"use client";

import { useState, useRef } from "react";
import { analyzeText, type AnalysisResult } from "@/lib/detection";
import { saveReport, type SavedReport } from "@/lib/report-store";
import { 
  FileText, Upload, Link as LinkIcon, Loader2, ScanLine, 
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"text" | "file" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentReport, setCurrentReport] = useState<SavedReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (text.trim().length < 150) return;
    setIsAnalyzing(true);
    setResult(null);
    setCurrentReport(null);
    try {
      const res = await analyzeText(text, (msg) => setProgressText(msg));
      setResult(res);
      if (!res.error) {
        const report = saveReport(res, text, activeTab === "url" ? url : "Pasted Text");
        setCurrentReport(report);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
      setProgressText("");
    }
  };

  const handleUrlScan = async () => {
    if (!url.trim()) return;
    setIsFetchingUrl(true);
    setProgressText("Fetching URL content...");
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch URL");
      setText(data.text);
      setActiveTab("text");
      setProgressText("URL content extracted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Error fetching URL: " + message);
    } finally {
      setIsFetchingUrl(false);
      setTimeout(() => setProgressText(""), 3000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB allowed.");
      return;
    }

    try {
      const content = await file.text();
      setText(content);
      setActiveTab("text");
    } catch (error) {
      alert("Error reading file.");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportPdf = () => {
    window.print();
  };

  const getVerdictColor = (prob: number) => {
    if (prob > 75) return "text-red-500";
    if (prob > 50) return "text-amber-500";
    if (prob > 30) return "text-yellow-500";
    return "text-emerald-500";
  };
  return (
    <div className="section-container py-12 flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Detection Workspace</h1>
        <p className="text-muted-foreground">Analyze content for AI generation and generate detailed authenticity reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="flex border-b border-border/50">
              <button 
                onClick={() => setActiveTab("text")}
                className={cn("flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors", activeTab === "text" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:bg-white/5")}
              >
                <FileText className="w-4 h-4" /> Paste Text
              </button>
              <button 
                onClick={() => setActiveTab("file")}
                className={cn("flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors", activeTab === "file" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:bg-white/5")}
              >
                <Upload className="w-4 h-4" /> Upload File
              </button>
              <button 
                onClick={() => setActiveTab("url")}
                className={cn("flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors", activeTab === "url" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:bg-white/5")}
              >
                <LinkIcon className="w-4 h-4" /> Scan URL
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === "text" && (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-80 bg-background border border-border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm leading-relaxed"
                    placeholder="Paste the text you want to analyze here... (Minimum 150 characters required)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs", text.length < 150 ? "text-amber-500" : "text-muted-foreground")}>
                      {text.length} / 25,000 chars {text.length > 0 && text.length < 150 && "(Need 150+)"}
                    </span>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || text.trim().length < 150}
                      className="btn-primary"
                    >
                      {isAnalyzing ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                      ) : (
                        <><ScanLine className="w-4 h-4" /> Analyze Content</>
                      )}
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "file" && (
                <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                  <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop a file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">Supports TXT (Max 5MB)</p>
                  <input
                    type="file"
                    accept=".txt"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs py-2">Select File</button>
                </div>
              )}
              {activeTab === "url" && (
                <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8">
                  <LinkIcon className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-6 text-center">Enter a webpage URL to extract and analyze its text content.</p>
                  <div className="w-full max-w-md flex flex-col gap-4">
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={handleUrlScan}
                      disabled={isFetchingUrl || !url.trim()}
                      className="btn-primary justify-center"
                    >
                      {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch & Analyze"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {progressText && (
             <div className="glass-card p-4 flex items-center justify-between">
               <span className="text-sm text-primary animate-pulse">{progressText}</span>
               <Loader2 className="w-4 h-4 text-primary animate-spin" />
             </div>
          )}

          {/* Result Breakdown */}
          {result && (
            <div className="glass-card p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                <span>Sentence-Level Analysis</span>
                <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-white/5 rounded border border-border/50">{result.segments} segments analyzed</span>
              </h3>
              
              <div className="flex gap-4 mb-6 text-xs border border-border/50 rounded-lg p-3 bg-background/50">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></div> AI Likely (&gt;75%)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></div> AI Possible (50-75%)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50"></div> Uncertain (30-50%)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded"></div> Human (&lt;30%)</div>
              </div>

              <div className="bg-background/80 border border-border/50 rounded-xl p-6 text-sm leading-loose break-words max-h-[500px] overflow-y-auto custom-scrollbar">
                {result.sentenceDetails.map((sentence, idx) => {
                  let highlightClass = "";
                  if (sentence.probability > 75) highlightClass = "bg-red-500/20 text-red-200 border-b-2 border-red-500/50";
                  else if (sentence.probability > 50) highlightClass = "bg-amber-500/20 text-amber-200 border-b-2 border-amber-500/50";
                  else if (sentence.probability > 30) highlightClass = "bg-yellow-500/20 text-yellow-200 border-b-2 border-yellow-500/50";
                  else highlightClass = "text-muted-foreground";

                  return (
                    <span key={idx} className={cn("px-1 py-0.5 rounded-sm mx-0.5 inline-block mb-1 relative group cursor-help", highlightClass)}>
                      {sentence.text}
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none whitespace-nowrap z-10 transition-opacity">
                        {sentence.probability.toFixed(0)}% AI
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results Overview */}
        <div className="space-y-6">
          <div className={cn("glass-card p-6 transition-all", result ? "border-primary/50 shadow-glow" : "")}>
            <h3 className="font-semibold mb-6 text-center text-sm uppercase tracking-wider text-muted-foreground">Detection Result</h3>
            
            {!result ? (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <ScanLine className="w-16 h-16 mb-4 text-muted-foreground" />
                <p className="text-sm">Awaiting content analysis</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="8"></circle>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className={getVerdictColor(result.probability)} strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (result.probability / 100) * 283}></circle>
                  </svg>
                  <div className="absolute text-center flex flex-col items-center">
                    <div className={cn("text-5xl font-black tracking-tighter", getVerdictColor(result.probability))}>
                      {result.probability.toFixed(1)}<span className="text-2xl">%</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-bold">AI Probability</div>
                  </div>
                </div>

                <div className="text-center w-full">
                  <div className={cn("inline-flex items-center gap-2 text-lg font-bold px-4 py-2 rounded-lg bg-background/50 border border-border/50", getVerdictColor(result.probability))}>
                    {result.label}
                  </div>
                </div>

                <div className="w-full mt-8 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-400 font-medium">AI-Generated</span>
                      <span className="font-mono text-red-400">{result.probability.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${result.probability}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-medium">Human-Written</span>
                      <span className="font-mono text-emerald-400">{(100 - result.probability).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${100 - result.probability}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <button onClick={handleExportPdf} className="btn-secondary w-full mt-8 text-sm">
                  <Download className="w-4 h-4" /> Export Report (PDF)
                </button>
              </div>
            )}
          </div>
          
          <div className="glass-card p-6">
             <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Writing Metrics</h3>
             {!result ? (
                <p className="text-xs text-muted-foreground text-center py-8">Available after analysis</p>
             ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 p-4 rounded-xl border border-border/50 text-center">
                     <div className="text-2xl font-bold mb-1">{result.segments}</div>
                     <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Segments</div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-border/50 text-center">
                     <div className="text-2xl font-bold mb-1">{result.sentenceDetails.length}</div>
                     <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Sentences</div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-border/50 text-center">
                     <div className="text-2xl font-bold mb-1">{(text.split(/\s+/).length).toLocaleString()}</div>
                     <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Words</div>
                  </div>
                  <div className="bg-background/50 p-4 rounded-xl border border-border/50 text-center">
                     <div className="text-2xl font-bold mb-1">{(text.length).toLocaleString()}</div>
                     <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Chars</div>
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

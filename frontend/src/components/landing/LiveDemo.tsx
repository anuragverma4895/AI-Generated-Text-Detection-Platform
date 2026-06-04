"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { analyzeText, type AnalysisResult } from "@/lib/detection";
import { Loader2, ArrowRight, ShieldAlert, CheckCircle2, HelpCircle, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveDemo() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (text.trim().length < 150) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeText(text, (msg) => setProgressText(msg));
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
      setProgressText("");
    }
  };

  const getVerdictIcon = (prob: number) => {
    if (prob > 75) return <ShieldAlert className="w-6 h-6 text-red-500" />;
    if (prob > 50) return <HelpCircle className="w-6 h-6 text-amber-500" />;
    if (prob > 30) return <HelpCircle className="w-6 h-6 text-yellow-500" />;
    return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
  };

  const getVerdictColor = (prob: number) => {
    if (prob > 75) return "text-red-500";
    if (prob > 50) return "text-amber-500";
    if (prob > 30) return "text-yellow-500";
    return "text-emerald-500";
  };

  return (
    <section id="demo" className="section-spacing relative overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-title">Try It Live</h2>
          <p className="section-subtitle">
            Paste any text below (min 150 characters) to see our detection engine in action.
          </p>
        </div>

        <div className="depth-card mx-auto max-w-4xl p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Input Area */}
            <div className="flex-1 flex flex-col gap-4">
              <label htmlFor="demo-input" className="text-sm font-medium text-muted-foreground">
                Text to analyze
              </label>
              <textarea
                id="demo-input"
                className="w-full h-64 resize-none rounded-xl border border-cyan-300/10 bg-slate-950/70 p-4 text-sm leading-relaxed shadow-inner shadow-black/40 transition-all focus:border-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Paste an essay, article, or any text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs", text.length < 150 ? "text-amber-500" : "text-muted-foreground")}>
                  {text.length} / 5,000 characters {text.length > 0 && text.length < 150 && "(Need 150+)"}
                </span>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || text.trim().length < 150}
                  className="btn-primary depth-button py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Text
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              {progressText && (
                <div className="text-xs text-primary animate-pulse text-right">{progressText}</div>
              )}
            </div>

            {/* Results Area */}
            <div className="w-full md:w-1/3 flex flex-col border-t md:border-t-0 md:border-l border-border/50 pt-8 md:pt-0 md:pl-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-6">Analysis Results</h3>
              
              {!result && !isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <ScanLine className="w-12 h-12 mb-4" />
                  <p className="text-sm">Awaiting text input...</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="8"></circle>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70"></circle>
                    </svg>
                  </div>
                  <p className="text-sm text-primary animate-pulse">Running Neural Network...</p>
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center"
                >
                  <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="8"></circle>
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                        className={getVerdictColor(result.probability)} 
                        strokeWidth="8" strokeDasharray="283" 
                        strokeDashoffset={283 - (result.probability / 100) * 283}
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      ></circle>
                    </svg>
                    <div className="absolute text-center">
                      <div className={cn("text-3xl font-bold", getVerdictColor(result.probability))}>
                        {result.probability.toFixed(1)}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {getVerdictIcon(result.probability)}
                    <span className={cn("font-bold text-lg", getVerdictColor(result.probability))}>
                      {result.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Based on {result.segments} segment(s) analyzed.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

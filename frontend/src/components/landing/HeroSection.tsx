"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, ScanLine, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb w-[500px] h-[500px] bg-primary/20 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="glow-orb w-[400px] h-[400px] bg-secondary/20 bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-bg border border-glass-border backdrop-blur-md mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-medium text-muted-foreground">TruthLens AI v2.0 is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          Know Whether Content Was <br className="hidden md:block" />
          <span className="gradient-text">Written by AI or Humans</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Advanced AI-powered authenticity analysis with detailed confidence scoring, sentence-level highlighting, and enterprise-grade reporting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard" className="btn-primary w-full sm:w-auto text-base py-3 px-8">
            <ScanLine className="w-5 h-5" />
            Start Free Analysis
          </Link>
          <Link href="/extension" className="btn-secondary w-full sm:w-auto text-base py-3 px-8">
            <Download className="w-5 h-5" />
            Download Extension
          </Link>
        </motion.div>

        {/* Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative mx-auto max-w-4xl animate-float"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 top-1/2"></div>
          <div className="glass-card p-2 md:p-4 border-t border-l border-white/10 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl">
            <div className="bg-bg-secondary rounded-xl md:rounded-[24px] border border-border/50 overflow-hidden relative">
              {/* Mockup Header */}
              <div className="h-10 border-b border-border/50 flex items-center px-4 gap-2 bg-background/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="mx-auto bg-background border border-border/50 rounded text-xs px-3 py-1 text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> truthlens.ai/dashboard
                </div>
              </div>
              {/* Mockup Body */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 relative">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                  <div className="h-4 bg-muted/20 rounded w-full"></div>
                  <div className="h-4 bg-primary/20 rounded w-5/6 relative overflow-hidden">
                     <div className="absolute inset-0 bg-primary/30 w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-muted/20 rounded w-full"></div>
                  <div className="h-4 bg-muted/20 rounded w-4/5"></div>
                  <div className="h-4 bg-primary/20 rounded w-2/3"></div>
                </div>
                <div className="w-full md:w-48 flex-shrink-0 flex flex-col items-center justify-center border-l border-border/50 pl-6 gap-4">
                   <div className="relative w-32 h-32 flex items-center justify-center">
                     <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                       <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="8"></circle>
                       <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-red-500 animate-pulse-glow" strokeWidth="8" strokeDasharray="283" strokeDashoffset="40"></circle>
                     </svg>
                     <div className="absolute text-center">
                       <div className="text-3xl font-bold text-red-500">85%</div>
                       <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Score</div>
                     </div>
                   </div>
                   <div className="text-sm font-medium text-red-500 bg-red-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                     🤖 Likely AI
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { EXTENSION_REPO_ZIP_URL } from "@/lib/constants";
import { Hero3DScene } from "./Hero3DScene";

export function HeroSection() {
  return (
    <section className="hero-shell relative overflow-hidden">
      <Hero3DScene />
      <div className="hero-depth-layer"></div>

      <div className="section-container relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
        <div className="text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100 shadow-[0_14px_40px_rgba(34,211,238,0.12)] backdrop-blur-md mb-8"
        >
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span className="text-sm font-semibold">TruthLens AI v2.0 is now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-5xl font-black leading-[0.98] md:text-7xl"
        >
          Detect AI Text With a <span className="gradient-text">3D Neural Lens</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0"
        >
          Advanced AI-powered authenticity analysis with detailed confidence scoring, sentence-level highlighting, and enterprise-grade reporting.
          Free to use from the first scan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
        >
          <Link href="/dashboard" className="btn-primary depth-button w-full sm:w-auto text-base py-3 px-8">
            <ScanLine className="w-5 h-5" />
            Start Free Analysis
          </Link>
          <a href={EXTENSION_REPO_ZIP_URL} download className="btn-secondary depth-button w-full sm:w-auto text-base py-3 px-8">
            <Download className="w-5 h-5" />
            Download Extension
          </a>
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="hero-console mx-auto w-full max-w-2xl lg:max-w-none"
        >
          <div className="depth-card p-2 md:p-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 md:rounded-[24px]">
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
              <div className="absolute inset-x-8 top-16 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.9)]"></div>
              <div className="relative flex flex-col gap-6 p-6 md:flex-row md:p-8">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-white/[0.12] rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-cyan-400/20 rounded w-5/6 relative overflow-hidden">
                     <div className="absolute inset-y-0 left-0 w-1/2 animate-pulse bg-cyan-300/35"></div>
                  </div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-4/5"></div>
                  <div className="h-4 bg-rose-400/20 rounded w-2/3"></div>
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
                   <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-300 ring-1 ring-red-400/20">
                     Likely AI
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

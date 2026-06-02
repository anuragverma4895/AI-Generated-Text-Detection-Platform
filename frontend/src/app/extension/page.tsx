"use client";

import { Download, Globe, Shield, Zap, Search, Eye } from "lucide-react";
import Link from "next/link";
import { EXTENSION_REPO_ZIP_URL } from "@/lib/constants";

export default function ExtensionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="glow-orb w-[600px] h-[600px] bg-primary/20 top-0 right-0 -translate-y-1/2 translate-x-1/3"></div>
        <div className="section-container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-bg border border-glass-border mb-6">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-muted-foreground">Chrome & Edge Extension</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Detect AI Content <span className="gradient-text">Anywhere</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
                Install the TruthLens AI extension to scan webpages, emails, and social media directly in your browser. Real-time analysis with a single click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href={EXTENSION_REPO_ZIP_URL} download className="btn-primary py-3 px-8 text-base justify-center">
                  <Download className="w-5 h-5" /> Download for Chrome
                </a>
                <Link href="/dashboard" className="btn-secondary py-3 px-8 text-base justify-center">
                  Try Web Version
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center md:text-left">
                Also compatible with Microsoft Edge, Brave, and other Chromium browsers.
              </p>
            </div>
            
            <div className="flex-1 relative animate-float w-full max-w-md mx-auto">
               <div className="aspect-[4/3] bg-background border border-border/50 rounded-2xl shadow-2xl overflow-hidden relative">
                 <div className="h-10 bg-background border-b border-border/50 flex items-center px-4 gap-2">
                   <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-amber-500/80"></div><div className="w-3 h-3 rounded-full bg-emerald-500/80"></div></div>
                   <div className="mx-auto bg-background/50 border border-border/50 rounded px-2 text-[10px] text-muted-foreground">example.com</div>
                 </div>
                 <div className="p-4 relative">
                   <div className="space-y-3">
                     <div className="h-3 bg-muted/20 w-3/4 rounded"></div>
                     <div className="h-3 bg-red-500/30 w-full rounded relative"><span className="absolute -top-3 right-0 bg-red-500 text-white text-[8px] font-bold px-1 rounded">89% AI</span></div>
                     <div className="h-3 bg-red-500/30 w-5/6 rounded"></div>
                     <div className="h-3 bg-muted/20 w-full rounded"></div>
                     <div className="h-3 bg-muted/20 w-4/5 rounded"></div>
                   </div>
                   
                   {/* Mock Extension Panel */}
                   <div className="absolute top-4 right-4 w-48 bg-background border border-border/50 rounded-xl shadow-2xl overflow-hidden">
                     <div className="p-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50 flex items-center gap-2">
                       <Shield className="w-4 h-4 text-primary" />
                       <span className="text-xs font-bold">TruthLens AI</span>
                     </div>
                     <div className="p-4 flex flex-col items-center border-b border-border/50">
                       <div className="text-2xl font-black text-red-500 mb-1">89%</div>
                       <div className="text-[10px] text-muted-foreground uppercase font-bold">AI Probability</div>
                     </div>
                     <div className="p-2 bg-background/50 text-center">
                       <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded">Likely AI</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-bg-secondary border-t border-border/40">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-center mb-12">Extension Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Context Menu Scan</h3>
              <p className="text-sm text-muted-foreground">Highlight any text, right-click, and select &quot;Check if AI-generated&quot; for instant analysis without leaving the page.</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 text-secondary">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Full Page Scan</h3>
              <p className="text-sm text-muted-foreground">Click the extension icon to run a comprehensive scan of the entire visible webpage content in seconds.</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-500">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Non-Intrusive UX</h3>
              <p className="text-sm text-muted-foreground">A draggable glassmorphism panel that stays out of your way until you need it. No popup blocking.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Installation Guide */}
      <section className="py-20">
        <div className="section-container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How to Install</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 p-6 glass-card items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Download the Repository</h4>
                <p className="text-sm text-muted-foreground mb-4">Get the source code directly from our GitHub repository.</p>
                <code className="text-xs bg-background p-3 rounded-lg border border-border/50 block w-full overflow-x-auto text-emerald-400">git clone https://github.com/anuragverma4895/AI-generated-text-detection.git</code>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 glass-card items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Open Browser Extensions Page</h4>
                <p className="text-sm text-muted-foreground">Navigate to <code className="text-xs text-primary bg-primary/10 px-1 py-0.5 rounded">chrome://extensions/</code> (or edge://extensions/).</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 glass-card items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Load Unpacked Extension</h4>
                <p className="text-sm text-muted-foreground">Enable <strong>Developer mode</strong> in the top right, click <strong>Load unpacked</strong>, and select the downloaded folder.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

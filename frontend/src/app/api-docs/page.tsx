"use client";

import { Book, Code, ShieldCheck } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="section-container py-12 flex-1 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="glass-card p-4 sticky top-24">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Documentation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#getting-started" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-primary font-medium">Getting Started</a></li>
            <li><a href="#open-access" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground">Open Access</a></li>
            <li><a href="#endpoints" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground">Endpoints</a></li>
          </ul>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">API Platform</h1>
          <p className="text-lg text-muted-foreground">Integrate the free TruthLens AI detection flow directly into your applications, CMS, or automated workflows.</p>
        </div>

        <div className="space-y-12">
          <section id="getting-started" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Book className="w-6 h-6 text-primary" /> Getting Started</h2>
            <div className="glass-card p-6">
              <p className="text-muted-foreground mb-4">
                The TruthLens API is a RESTful service that accepts JSON requests and returns AI probability scores along with sentence-level breakdowns. 
                Our API handles text chunking and language translation automatically.
              </p>
              <div className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm">
                <span className="text-muted-foreground">Backend route:</span> <span className="text-emerald-400">/api/v1/detection/detect</span>
              </div>
            </div>
          </section>

          <section id="open-access" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-secondary" /> Open Access</h2>
            <div className="glass-card p-6">
              <p className="text-muted-foreground mb-4">
                Send text to the detection endpoint and handle the JSON response in your app. The public detector flow is open and does not require an API key.
              </p>
              <pre className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-gray-300">Content-Type: application/json</code>
              </pre>
            </div>
          </section>

          <section id="endpoints" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Code className="w-6 h-6 text-emerald-500" /> Endpoints</h2>
            
            <div className="glass-card overflow-hidden">
              <div className="bg-background/80 border-b border-border/50 p-4 flex items-center gap-4">
                <span className="px-3 py-1 rounded bg-green-500/20 text-green-400 font-bold text-xs uppercase tracking-wider">POST</span>
                <span className="font-mono text-sm">/api/v1/detection/detect</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">Analyze text for AI generation probability.</p>
                <h4 className="font-semibold text-sm mb-2">Request Body (JSON)</h4>
                <div className="space-y-4 mb-8">
                  <div className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="font-mono text-sm text-primary mb-1">text <span className="text-muted-foreground text-xs">(string)</span></div>
                    <p className="text-sm text-muted-foreground">The text you want to analyze. Minimum length is 150 characters.</p>
                  </div>
                </div>

                <pre className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6 text-gray-300">
{`{
  "text": "The quick brown fox jumps over the lazy dog."
}`}
                </pre>
                
                <h4 className="font-semibold text-sm mb-2">Response (200 OK)</h4>
                <pre className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
{`{
  "probability": 85.5,
  "label": "Likely AI-Generated",
  "segments": 3,
  "segmentDetails": [
    {
      "text": "The rapid advancement of artificial intelligence has revolutionized...",
      "probability": 92.1,
      "label": "AI-Generated"
    }
  ],
  "sentenceDetails": [
    {
      "text": "The rapid advancement of artificial intelligence has revolutionized...",
      "probability": 92.1,
      "label": "AI-Generated"
    }
  ]
}`}
                </pre>
                
                <h4 className="font-semibold text-sm mt-8 mb-2">Response Parameters</h4>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="font-mono text-sm text-primary mb-1">probability <span className="text-muted-foreground text-xs">(number)</span></div>
                    <p className="text-sm text-muted-foreground">The overall confidence score (0-100) that the text is AI-generated.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="font-mono text-sm text-primary mb-1">label <span className="text-muted-foreground text-xs">(string)</span></div>
                    <p className="text-sm text-muted-foreground">The human-readable classification (e.g., "Human-Written", "Likely AI-Generated").</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="font-mono text-sm text-primary mb-1">segments <span className="text-muted-foreground text-xs">(number)</span></div>
                    <p className="text-sm text-muted-foreground">The number of chunks the input text was divided into for analysis.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="font-mono text-sm text-primary mb-1">segmentDetails <span className="text-muted-foreground text-xs">(array)</span></div>
                    <p className="text-sm text-muted-foreground">Detailed analysis for each segment.</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="font-mono text-sm text-primary mb-1">sentenceDetails <span className="text-muted-foreground text-xs">(array)</span></div>
                    <p className="text-sm text-muted-foreground">Detailed analysis for each sentence, including its individual probability score.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

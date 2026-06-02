"use client";

import { Book, Code, ShieldAlert } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="section-container py-12 flex-1 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="glass-card p-4 sticky top-24">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Documentation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#getting-started" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-primary font-medium">Getting Started</a></li>
            <li><a href="#authentication" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground">Authentication</a></li>
            <li><a href="#endpoints" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground">Endpoints</a></li>
            <li><a href="#rate-limits" className="block p-2 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground">Rate Limits</a></li>
          </ul>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">API Platform</h1>
          <p className="text-lg text-muted-foreground">Integrate TruthLens AI detection directly into your applications, CMS, or automated workflows.</p>
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
                <span className="text-muted-foreground">Base URL:</span> <span className="text-emerald-400">https://api.truthlens.ai/v1</span>
              </div>
            </div>
          </section>

          <section id="authentication" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-secondary" /> Authentication</h2>
            <div className="glass-card p-6">
              <p className="text-muted-foreground mb-4">
                Authenticate your API requests by including your secret API key in the `Authorization` header. You can manage your API keys in the User Dashboard.
              </p>
              <pre className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <code className="text-gray-300">Authorization: Bearer <span className="text-amber-300">sk_live_...</span></code>
              </pre>
            </div>
          </section>

          <section id="endpoints" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Code className="w-6 h-6 text-emerald-500" /> Endpoints</h2>
            
            <div className="glass-card overflow-hidden">
              <div className="bg-background/80 border-b border-border/50 p-4 flex items-center gap-4">
                <span className="px-3 py-1 rounded bg-green-500/20 text-green-400 font-bold text-xs uppercase tracking-wider">POST</span>
                <span className="font-mono text-sm">/detect</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4">Analyze text for AI generation probability.</p>
                <h4 className="font-semibold text-sm mb-2">Request Body (JSON)</h4>
                <pre className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6 text-gray-300">
{`{
  "text": "The quick brown fox jumps over the lazy dog."
}`}
                </pre>
                
                <h4 className="font-semibold text-sm mb-2">Response (200 OK)</h4>
                <pre className="bg-background border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
{`{
  "probability": 12.5,
  "label": "Likely Human-Written",
  "segments_analyzed": 1,
  "sentences": [
    {
      "text": "The quick brown fox jumps over the lazy dog.",
      "probability": 12.5
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

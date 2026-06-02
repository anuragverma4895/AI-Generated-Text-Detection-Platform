import Link from "next/link";
import { Code2, Download, ScanLine, ShieldCheck } from "lucide-react";
import { EXTENSION_REPO_ZIP_URL } from "@/lib/constants";

const freeTools = [
  {
    id: "web-detector",
    icon: ScanLine,
    title: "Free Web Detector",
    description:
      "Paste long-form text, run the detector, and review the AI probability with sentence-level output.",
    action: "Open Detector",
    href: "/dashboard",
    primary: true,
  },
  {
    id: "extension",
    icon: Download,
    title: "Free Browser Extension",
    description:
      "Install the Chromium extension and scan selected text or full webpages directly in your browser.",
    action: "Download Extension",
    href: EXTENSION_REPO_ZIP_URL,
    download: true,
  },
  {
    id: "api",
    icon: Code2,
    title: "Free API Docs",
    description:
      "Use the open detection endpoint details to connect TruthLens AI with your own project.",
    action: "View API Docs",
    href: "/api-docs",
  },
];

export function FreePlatformSection() {
  return (
    <section id="free-platform" className="section-spacing bg-bg-secondary border-t border-border/40">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            100% free access
          </div>
          <h2 className="section-title">One Connected Free Platform</h2>
          <p className="section-subtitle">
            TruthLens AI is free to use across the web detector, browser extension, and developer API reference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freeTools.map((tool) => {
            const Icon = tool.icon;
            const cardContent = (
              <>
                <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {tool.description}
                </p>
                <span className={tool.primary ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}>
                  {tool.action}
                </span>
              </>
            );

            return tool.download ? (
              <a
                key={tool.id}
                id={tool.id}
                href={tool.href}
                download
                className="glass-card p-8 flex flex-col scroll-mt-28"
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={tool.id}
                id={tool.id}
                href={tool.href}
                className="glass-card p-8 flex flex-col scroll-mt-28"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

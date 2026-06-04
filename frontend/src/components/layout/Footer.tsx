import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950/85 backdrop-blur-sm">
      <div className="section-container">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent"></div>

        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:gap-16 lg:py-16">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
              </span>
              <span className="text-xl font-bold">{SITE_NAME}</span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">
              {SITE_DESCRIPTION}
            </p>
            <a
              href="https://github.com/anuragverma4895"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-cyan-300"
            >
              GitHub
            </a>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">Product</h3>
            <ul className="space-y-4">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free Detector</Link></li>
              <li><Link href="/#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Live Demo</Link></li>
              <li><Link href="/extension" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browser Extension</Link></li>
              <li><Link href="/api-docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Platform</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/reports" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sample Reports</Link></li>
              <li><Link href="/#extension" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free Extension</Link></li>
              <li><Link href="/#api" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">Access</h3>
            <ul className="space-y-4">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Start Free Analysis</Link></li>
              <li><Link href="/#free-platform" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free Platform</Link></li>
              <li>
                <a
                  href="https://github.com/anuragverma4895"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Free to use.</p>
          <p>Powered by ELECTRA Deep Learning Model</p>
        </div>
      </div>
    </footer>
  );
}

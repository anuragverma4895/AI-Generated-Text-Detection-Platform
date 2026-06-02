import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm relative z-10">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {SITE_DESCRIPTION}
            </p>
            <a
              href="https://github.com/anuragverma4895"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free Detector</Link></li>
              <li><Link href="/#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Live Demo</Link></li>
              <li><Link href="/extension" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browser Extension</Link></li>
              <li><Link href="/api-docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Platform</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/reports" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sample Reports</Link></li>
              <li><Link href="/#extension" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free Extension</Link></li>
              <li><Link href="/#api" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Access</h3>
            <ul className="space-y-3">
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

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Free to use.</p>
          <p>Powered by ELECTRA Deep Learning Model</p>
        </div>
      </div>
    </footer>
  );
}

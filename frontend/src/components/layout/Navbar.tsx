"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionHref, setActiveSectionHref] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sectionLinks = NAV_LINKS.filter((link) => link.href.startsWith("/#"));
    const sectionIds = sectionLinks.map((link) => link.href.replace("/#", ""));

    const updateActiveSection = () => {
      const headerOffset = 96;
      let currentHref = "";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const bounds = section.getBoundingClientRect();
        if (bounds.top <= headerOffset && bounds.bottom > headerOffset) {
          currentHref = `/#${id}`;
        }
      }

      setActiveSectionHref(currentHref);
    };

    const frame = window.requestAnimationFrame(updateActiveSection);
    const delayedFrame = window.setTimeout(updateActiveSection, 250);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayedFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/" && activeSectionHref === href;
    return pathname === href;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/88 backdrop-blur-2xl">
      <div className="section-container flex h-16 items-center justify-between gap-5">
        <Link href="/" className="flex min-w-fit items-center gap-3 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-white/[0.07] text-cyan-100 shadow-sm transition-colors group-hover:border-cyan-300/45 group-hover:bg-cyan-300/10">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-extrabold tracking-tight text-white sm:block">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex">
          <ul className="flex min-w-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-full px-3.5 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white",
                    isActiveLink(link.href) && "bg-gradient-to-r from-cyan-400/20 to-violet-400/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/dashboard" className="btn-primary shrink-0 px-5 py-2 text-sm">
            Free Detector
          </Link>
        </nav>

        <button
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-slate-950/96 backdrop-blur-xl lg:hidden"
          >
            <div className="section-container flex flex-col gap-2 py-4">
              <ul className="grid gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.08] hover:text-white",
                        isActiveLink(link.href) && "bg-gradient-to-r from-cyan-400/20 to-violet-400/20 text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="btn-primary mt-2 w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Free Detector
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

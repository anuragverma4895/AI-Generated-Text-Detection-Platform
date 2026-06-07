"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  FileText,
  ScanSearch,
  Globe,
  Zap,
  Shield,
  FileCheck2,
} from "lucide-react";

const features = [
  {
    icon: <ScanSearch className="w-6 h-6 text-primary" />,
    title: "Deep Sequence Analysis",
    description: "Powered by a state-of-the-art ELECTRA neural network that analyzes context and token probabilities.",
  },
  {
    icon: <FileText className="w-6 h-6 text-secondary" />,
    title: "Sentence-Level Highlighting",
    description: "Don't just get a score. See exactly which sentences trigger the AI detectors with precise color-coding.",
  },
  {
    icon: <FileCheck2 className="w-6 h-6 text-emerald-500" />,
    title: "PDF & Document Support",
    description: "Upload PDFs, Docs, and files directly. We extract the text and analyze large documents seamlessly.",
  },
  {
    icon: <Globe className="w-6 h-6 text-amber-500" />,
    title: "Multi-Language Ready",
    description: "Built-in translation pipeline automatically processes non-English text for universal detection.",
  },
  {
    icon: <Zap className="w-6 h-6 text-cyan-500" />,
    title: "Real-Time Extension",
    description: "Scan any webpage instantly with our Chrome and Edge extension. Just click the shield or select text.",
  },
  {
    icon: <Shield className="w-6 h-6 text-rose-500" />,
    title: "Enterprise Grade Reports",
    description: "Generate and export beautiful PDF, CSV, and JSON reports with your branding for clients or academic use.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="section-spacing scroll-mt-20 bg-bg-secondary relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">Beyond Basic Detection</h2>
          <p className="section-subtitle">
            TruthLens AI combines advanced natural language processing with an intuitive interface to give you unprecedented visibility into content origins.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="depth-card tilt-card group p-8">
              <div className="icon-cube mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

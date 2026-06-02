"use client";

import { PricingSection } from "@/components/landing/PricingSection";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="section-container text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Plans for everyone
        </h1>
        <p className="text-lg text-muted-foreground">
          Whether you're a student checking your essays, a teacher reviewing submissions, or an enterprise integrating detection into your workflow.
        </p>
      </div>
      
      <PricingSection />

      {/* FAQ Section */}
      <section className="section-spacing bg-bg-secondary border-t border-border/40">
        <div className="section-container max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How accurate is the AI detection?", a: "Our ELECTRA-based model achieves over 98% accuracy on standard benchmarks. However, AI detection is probabilistic. We recommend using the tool as a strong signal rather than absolute proof." },
              { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your Pro or Enterprise subscription at any time from your account dashboard. You'll retain access until the end of your billing cycle." },
              { q: "Do you store the text I analyze?", a: "For Free and Pro users, text is processed securely in memory and never stored. Enterprise users have the option to opt-in to secure private data storage for organizational compliance." },
              { q: "What languages are supported?", a: "The detection model is natively trained on English, but we use a Google Translate pipeline to automatically translate and analyze content in over 100 languages with high accuracy." }
            ].map((faq, idx) => (
              <div key={idx} className="glass-card p-6">
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export const SITE_NAME = "TruthLens AI";
export const SITE_DESCRIPTION =
  "Advanced AI-powered content authenticity analysis with detailed confidence scoring and enterprise-grade reporting.";
export const SITE_URL = "https://truthlens.ai";

export const HF_API_URL =
  "https://dipaghosh56-electra-ai-vs-human.hf.space/api/predict";
export const TRANSLATE_API =
  "https://translate.googleapis.com/translate_a/single";
export const EXTENSION_REPO_ZIP_URL =
  "https://github.com/anuragverma4895/AI-generated-text-detection/archive/refs/heads/main.zip";

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Extension", href: "/extension" },
  { label: "API", href: "/api-docs" },
] as const;

export const VERDICT_CONFIG = {
  high: { label: "Likely AI-Generated", color: "#ef4444", threshold: 75 },
  medium: { label: "Possibly AI-Generated", color: "#f59e0b", threshold: 50 },
  low: { label: "Mixed / Uncertain", color: "#eab308", threshold: 30 },
  human: { label: "Likely Human-Written", color: "#22c55e", threshold: 0 },
} as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for occasional use and trying things out",
    features: [
      "5 scans per day",
      "Text paste analysis",
      "Basic confidence scores",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and content teams",
    features: [
      "Unlimited scans",
      "File upload support",
      "Detailed writing metrics",
      "PDF/CSV/JSON reports",
      "API access (10K calls/mo)",
      "Scan history & analytics",
      "Priority support",
      "Browser extension pro",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited API calls",
      "Team workspace",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated support",
      "On-premise option",
      "SSO / SAML",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

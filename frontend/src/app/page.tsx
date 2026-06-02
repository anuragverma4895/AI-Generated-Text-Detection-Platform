import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { FreePlatformSection } from "@/components/landing/FreePlatformSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <LiveDemo />
      <FreePlatformSection />
    </div>
  );
}


import { Hero } from "@/components/landing/Hero";
import { Metrics } from "@/components/landing/Metrics";
import { FeaturesSplit } from "@/components/landing/FeaturesSplit";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { SocialProof } from "@/components/landing/SocialProof";
import { ProblemGap } from "@/components/landing/ProblemGap";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="relative">
        <Hero />
        <Metrics />
      </div>

      {/* Curved Divider Effect */}
      <div className="relative z-10 bg-background rounded-t-[3rem] -mt-10 border-t border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <SocialProof />
        <ProblemGap />
        <FeaturesSplit />
        <FAQ />
        <FinalCTA />
      </div>
    </div>
  );
}

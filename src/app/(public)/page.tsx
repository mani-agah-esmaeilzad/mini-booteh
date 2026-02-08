
import { Hero } from "@/components/landing/Hero";
import { Metrics } from "@/components/landing/Metrics";
import { SocialProof } from "@/components/landing/SocialProof";
import { ProblemGap } from "@/components/landing/ProblemGap";
import { SectionNavigator } from "@/components/landing/SectionNavigator";
import { FeaturesSplit } from "@/components/landing/FeaturesSplit";
import { Roadmap } from "@/components/landing/Roadmap";
import { Episodes } from "@/components/landing/Episodes";
import { SkillAnalytics }
  from "@/components/landing/SkillAnalytics";
import { CaseStudy } from "@/components/landing/CaseStudy";
import { Workspace } from "@/components/landing/Workspace";
import { Hiring } from "@/components/landing/Hiring";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

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
        <SectionNavigator />
        <FeaturesSplit />
        <Roadmap />
        <Episodes />
        <SkillAnalytics />
        <CaseStudy />
        <Workspace />
        <Hiring />
        <FAQ />
        <FinalCTA />
      </div>
    </div>
  );
}

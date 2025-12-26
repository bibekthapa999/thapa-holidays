import React from "react";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import StorySection from "@/components/StorySection";
import ValuesSection from "@/components/ValuesSection";
import CTASection from "@/components/CTASection";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-36 pb-20 bg-gradient-to-b from-teal-50 to-white">
      <HeroSection />
      <StatsSection />
      <StorySection />
      <ValuesSection />
      <CTASection />
    </div>
  );
}

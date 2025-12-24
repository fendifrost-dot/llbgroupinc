import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { MethodologySection } from "@/components/home/MethodologySection";
import { CredibilitySection } from "@/components/home/CredibilitySection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PillarsSection />
      <MethodologySection />
      <CredibilitySection />
      <CTASection />
    </Layout>
  );
};

export default Index;

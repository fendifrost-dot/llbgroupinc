import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { ValueCreationSection } from "@/components/home/ValueCreationSection";
import { WhoWeServeSection } from "@/components/home/WhoWeServeSection";
import { ExecutionSection } from "@/components/home/ExecutionSection";
import { ServicesFocusSection } from "@/components/home/ServicesFocusSection";
import { BeyondConsultingSection } from "@/components/home/BeyondConsultingSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PillarsSection />
      <ValueCreationSection />
      <WhoWeServeSection />
      <ExecutionSection />
      <ServicesFocusSection />
      <BeyondConsultingSection />
      <CTASection />
    </Layout>
  );
};

export default Index;

import IntegrationsSection from "@/components/integrations-2";
import { Endline } from "@/components/landing/endline";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";

export default function Home() {
  return (
  <div>
     <Header />
    <div className="flex justify-center items-center flex-col h-[86vh] w-full">
     <HeroSection />
    </div>
     <div className="w-full h-screen">
      <IntegrationsSection />
     </div>
  
     <Footer />
  </div>
  );
}

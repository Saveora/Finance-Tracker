import HowItWorks from "../components/Howitworks";
import HeroSection from "../components/herosection";
import Features from "@/components/Features";
import FaqAccordion from "@/components/FaqAccordion";
import SmartBanner from "@/components/SmartBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      
        <HeroSection />
      

      <section id="how-it-works">
      
        <HowItWorks />
        
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="faqs">
        <FaqAccordion />
      </section>

      <section id="smartbanner">
        <SmartBanner />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </>
  );
}

import HowItWorks from "../components/Howitworks";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <>
      
        <HeroSection />
      

      <section id="how-it-works">
      
        <HowItWorks />
        
      </section>

      <section id="features">
        <div className="h-screen bg-gray-100 flex items-center justify-center text-2xl">
          Features section placeholder
        </div>
      </section>

      <section id="testimonials">
        <div className="h-screen bg-gray-200 flex items-center justify-center text-2xl">
          Testimonials section placeholder
        </div>
      </section>

      <section id="pricing">
        <div className="h-screen bg-gray-300 flex items-center justify-center text-2xl">
          Pricing section placeholder
        </div>
      </section>

      <section id="contact">
        <div className="h-screen bg-gray-400 flex items-center justify-center text-2xl">
          Contact section placeholder
        </div>
      </section>
    </>
  );
}

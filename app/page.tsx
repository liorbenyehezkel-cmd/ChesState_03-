import { FaqAccordion } from "@/components/FaqAccordion";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { TrustBar } from "@/components/TrustBar";
import { WaitlistProvider } from "@/components/WaitlistProvider";

export default function HomePage() {
  return (
    <WaitlistProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ExplainerVideo />
        <HowItWorks />
        <FaqAccordion />
      </main>
      <Footer />
    </WaitlistProvider>
  );
}

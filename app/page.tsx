import { FaqAccordion } from "@/components/FaqAccordion";
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
        <HowItWorks />
        <FaqAccordion />
      </main>
      <Footer />
    </WaitlistProvider>
  );
}

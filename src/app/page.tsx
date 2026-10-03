import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Approach } from "@/components/sections/Approach";
import { Capabilities } from "@/components/sections/Capabilities";
import { CtaBand } from "@/components/sections/CtaBand";
import { Equipment } from "@/components/sections/Equipment";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <a
        href="#capabilities"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-aqua focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-abyss"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <Hero />
        <Capabilities />
        <Approach />
        <Equipment />
        <Projects />
        <Industries />
        <CtaBand />
      </main>

      <Footer />
    </>
  );
}

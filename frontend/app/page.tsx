"use client";

import Link from "next/link";
import Galaxy from "@/components/Galaxy";
import TextType from "@/components/TextType";
import StarBorder from "@/components/StarBorder";
import { motion } from "framer-motion";
import { MissionSection } from "@/components/landing/MissionSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-primary/30 scroll-smooth">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Galaxy 
          speed={0.5} 
          density={1.5} 
          glowIntensity={0.5} 
          hueShift={200} 
          twinkleIntensity={0.5} 
        />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 border-b border-white/5">
        <section className="text-center max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter mb-6 mix-blend-difference">
              <TextType 
                text={["RIVAL_ENGINE", "REACH_THE_HORIZON", "FUTURE_FLOW"]} 
                typingSpeed={80}
                pauseDuration={3000}
                className="inline-block"
                // @ts-ignore
                textColors={["#22d3ee", "#ffffff", "#818cf8"] as string[]}
              />
            </h1>
            
            <p className="font-mono text-sm md:text-base text-zinc-400 uppercase tracking-[0.3em] mb-12 max-w-2xl mx-auto leading-relaxed">
              &gt; THE_NEXT_GENERATION_OF_HIGH_MOTION_BLOGGING_AND_DATA_VISUALIZATION. 
              <span className="animate-pulse">_</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/feed">
                <StarBorder
                  as="div"
                  color="cyan"
                  speed="5s"
                  className="px-10 py-4 bg-background/50 backdrop-blur-md"
                >
                  <span className="font-mono font-bold tracking-widest text-sm">INITIALIZE_FEED</span>
                </StarBorder>
              </Link>
              
              <Link href="/login">
                <button className="px-10 py-4 font-mono text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-muted-foreground hover:text-white">
                  ACCESS_PORTAL
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Floating Tag */}
        <div className="absolute bottom-12 flex flex-col items-center gap-4 animate-bounce opacity-20">
           <span className="text-[10px] font-mono uppercase tracking-[0.4em] rotate-90">SCROLL</span>
           <div className="w-px h-12 bg-white" />
        </div>
      </main>

      {/* Expanded Sections */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm">
        <MissionSection />
        <StatsSection />
        <IntegrationsSection />
        <CTASection />
      </div>
      
      {/* Decorative Overlays */}
      <div className="pointer-events-none fixed inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] opacity-50" />
    </div>
  );
}

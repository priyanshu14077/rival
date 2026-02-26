"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StarBorder from "@/components/StarBorder";

export function CTASection() {
  return (
    <section className="py-60 px-6 relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[160px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">System_v1.0_Online</span>
          </div>

          <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">
            READY_FOR_THE_NEXT_<br />TRANSMISSION?
          </h2>

          <p className="font-mono text-sm md:text-base text-zinc-500 uppercase tracking-[0.3em] mb-16 max-w-2xl leading-relaxed">
            &gt; SECURE_YOUR_ID_AND_BEGIN_THE_BROADCAST_ACROSS_THE_GLOBAL_NEURAL_NETWORK.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mb-16">
            {[
              { label: "PROTOCOL", val: "RSA-4096" },
              { label: "ENCRYPTION", val: "AES-256-GCM" },
              { label: "BROADCAST", val: "REAL_TIME" }
            ].map((meta, i) => (
              <div key={i} className="flex flex-col gap-1 text-center md:text-left border-l border-white/10 pl-4 py-2">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{meta.label}</span>
                <span className="text-xs font-mono text-primary font-bold">{meta.val}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            <Link href="/register">
              <StarBorder as="div" color="cyan" speed="6s" className="px-16 py-6 bg-background/50 backdrop-blur-md">
                <span className="font-heading font-bold text-xl tracking-[0.2em]">INITIALIZE_IDENTITY</span>
              </StarBorder>
            </Link>
            
            <Link href="/login">
               <button className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-colors border-b border-white/10 pb-1">
                 EXISTING_NODE_ACCESS &gt;
               </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export function MissionSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-xs font-mono text-primary uppercase tracking-[0.5em] mb-6 block">SYSTEM_PURPOSE</span>
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">
            DEFINING_THE_HORIZON
          </h2>
          <div className="space-y-6 font-mono text-sm text-zinc-400 leading-relaxed max-w-xl">
            <p>
              &gt; RIVAL IS NOT JUST A BLOGGING PLATFORM; IT IS A HIGH-MOTION DATA TRANSMISSION PROTOCOL DESIGNED FOR THE NEXT ERA OF THE WEB.
            </p>
            <p>
              &gt; BY LEVERAGING REACTIVE DATA STREAMS AND IMMERSIVE VISUALIZATION, WE TRANSFORM STATIC CONTENT INTO LIVING NEURAL NODES.
            </p>
            <p className="p-4 border border-primary/20 bg-primary/5 italic text-primary/80">
              "THE ARCHITECTURE OF INFORMATION IS THE ARCHITECTURE OF PERCEPTION."
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative aspect-square"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute inset-0 border border-white/5 rounded-full rotate-45 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-10 border border-primary/20 rounded-full -rotate-45 animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="size-32 bg-white/5 backdrop-blur-3xl border border-white/10 rotate-45 flex items-center justify-center p-8 group hover:border-primary/50 transition-colors">
                <span className="text-4xl font-heading font-bold mix-blend-difference group-hover:scale-110 transition-transform">R</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const techs = ["NEXT.JS", "NESTJS", "PRISMA", "REDIS", "TRPC", "TAILWIND", "GSAP", "FRAMER"];

export function IntegrationsSection() {
  return (
    <section className="py-40 px-6 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-12 blur-2xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
           <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.8em] mb-4">CORE_STRICTURES</h3>
           <p className="text-2xl font-heading font-bold text-white italic opacity-80 uppercase tracking-tighter">BUILT_ON_FOUNDATIONS_OF_LIGHT</p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-20 gap-y-12 max-w-5xl mx-auto">
          {techs.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <span className="text-3xl md:text-5xl font-heading font-black text-zinc-800 group-hover:text-white transition-all duration-500 cursor-default uppercase tracking-tighter italic hover:scale-110 block">
                {tech}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

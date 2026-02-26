import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function StatsSection() {
  const { data } = useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      return await api.get("/public/stats") as any;
    },
    refetchInterval: 30000, // Refresh every 30s for a "live" feel
  });

  const stats = [
    { label: "TRANSMISSIONS", value: data?.blogs ?? "...", detail: "VERIFIED_PUBLIC_NODES" },
    { label: "ENTITIES", value: data?.users ?? "...", detail: "REGISTERED_NEURAL_UNITS" },
    { label: "INTERACTIONS", value: ((data?.likes || 0) + (data?.comments || 0)) || "...", detail: "PACKET_EXCHANGE_TOTAL" },
    { label: "LATENCY", value: "<1ms", detail: "SYSTEM_THROUGHPUT" }
  ];

  return (
    <section className="py-32 px-6 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-black p-10 flex flex-col items-center text-center group hover:bg-zinc-900 transition-colors cursor-crosshair"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-6">{stat.label}</span>
                <span className="text-5xl font-heading font-black text-white mb-2 group-hover:text-primary transition-colors tracking-tighter italic">
                  {stat.value}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{stat.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

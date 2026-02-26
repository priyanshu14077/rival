"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { user, clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-white/10 rounded-full hover:bg-zinc-800 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
           <User size={14} className="text-primary" />
        </div>
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider hidden sm:inline-block">
            {user.name?.split(' ')[0] || 'NEURAL_UNIT'}
        </span>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 bg-black border border-white/10 shadow-2xl z-[100] backdrop-blur-xl"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="p-4 border-b border-white/5">
                <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Authenticated Entity</p>
                <p className="text-xs font-bold text-white truncate">{user.email}</p>
            </div>
            
            <div className="p-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer group">
                        <LayoutDashboard size={14} className="group-hover:text-primary transition-colors" />
                        <span>DASHBOARD</span>
                    </div>
                </Link>
                
                <div 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors cursor-pointer group"
                >
                    <LogOut size={14} />
                    <span>TERMINATE_SESSION</span>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

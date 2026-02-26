"use client";

import LightRays from "@/components/LightRays";
import TextType from "@/components/TextType";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Form Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12 z-10 bg-background/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-b md:border-b-0 md:border-r border-border">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

      {/* Visual Sidebar */}
      <div className="hidden md:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
           {/* Not rendering LightRays perfectly inside container natively requires absolute bounds */}
          <div className="w-full h-full relative">
             <LightRays />
          </div>
        </div>
        
        <div className="z-10 text-center px-12 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            RIVAL
          </h1>
          <div className="text-xl md:text-2xl font-mono text-cyan-400">
            <TextType 
              texts={[
                "EXPERIMENTAL BLOGGING",
                "KINETIC THINKING",
                "BRUTALIST VIBES",
                "CREATE WITHOUT LIMITS"
              ]}
              speed={50}
              deletionSpeed={25}
              pauseTime={3000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Blog } from "@/types";
import { BlogCard } from "@/components/blogs/BlogCard";

interface FeedResponse {
  items: Blog[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
  };
}

export default function FeedPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs", "feed"],
    queryFn: async () => {
      const response = await api.get("/public/feed");
      return response as unknown as FeedResponse;
    },
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background pt-32">
        <div className="text-center p-8 border border-destructive/50 font-mono">
           <h2 className="text-destructive font-bold mb-4">CRITICAL_SYSTEM_ERROR</h2>
           <p className="text-muted-foreground italic">Failed to retrieve data streams.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-heading font-bold tracking-tighter mb-4 text-white mix-blend-difference">
            GLOBAL_DATAFEED
          </h1>
          <div className="h-px w-full bg-gradient-to-r from-primary/50 via-white/10 to-transparent mb-4" />
          <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest italic">
            Monitoring active transmissions...
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] border border-white/5 bg-zinc-900/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((blog) => (
               <BlogCard key={blog.id} blog={blog} />
            ))}
            
            {data?.items.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10">
                <p className="font-mono text-muted-foreground">NO_VITAL_SIGNS_DETECTED</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

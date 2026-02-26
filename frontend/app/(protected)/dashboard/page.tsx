"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Blog } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import StarBorder from "@/components/StarBorder";
import { format } from "date-fns";

interface DashboardResponse {
  items: Blog[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: async () => {
      const response = await api.get("/blogs"); // Gets only current user's blogs
      return response as unknown as DashboardResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      toast.success("NODE_PURGED: Data successfully removed from sequence");
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "feed"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "PURGE_FAILURE");
    },
  });

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-heading font-black tracking-tighter text-white mb-2">
              COMMAND_DASHBOARD
            </h1>
            <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest italic">
              Accessing user_data_nodes...
            </p>
          </div>
          
          <Link href="/create">
            <StarBorder as="div" color="cyan" speed="4s" className="px-8 py-3 bg-background/50">
              <span className="font-mono font-bold tracking-widest text-xs">INIT_NEW_TRANSMISSION</span>
            </StarBorder>
          </Link>
        </header>

        {isLoading ? (
          <div className="space-y-4">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-24 w-full border border-white/5 bg-zinc-900/50 animate-pulse" />
             ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.items.map((blog) => (
              <div key={blog.id} className="group flex items-center justify-between p-6 border border-white/5 bg-zinc-900/20 backdrop-blur-sm hover:border-primary/30 transition-all">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${blog.isPublished ? "border-green-500/50 text-green-500" : "border-yellow-500/50 text-yellow-500"}`}>
                      {blog.isPublished ? "STATUS: LIVE" : "STATUS: DRAFT"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground italic">
                    CREATED: {format(new Date(blog.createdAt), "yyyy.MM.dd HH:mm")} | SLUG: /{blog.slug}
                  </span>
                </div>

                <div className="flex gap-4">
                  <Link href={`/blogs/${blog.slug}`}>
                    <button className="text-[10px] font-mono text-muted-foreground hover:text-white transition-colors uppercase tracking-widest underline underline-offset-4">
                      PREVIEW
                    </button>
                  </Link>
                  <button 
                    onClick={() => {
                        if(confirm("CONFIRM_PURGE: Are you sure you want to delete this transmission?")) {
                            deleteMutation.mutate(blog.id);
                        }
                    }}
                    className="text-[10px] font-mono text-destructive hover:text-red-400 transition-colors uppercase tracking-widest border border-destructive/20 px-3 py-1 hover:bg-destructive/5"
                  >
                    PURGE
                  </button>
                </div>
              </div>
            ))}

            {data?.items.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/10">
                <p className="font-mono text-muted-foreground mb-8">NO_DATA_NODES_FOUND_IN_SYSTEM</p>
                <Link href="/create">
                   <button className="text-xs font-mono text-primary uppercase tracking-[0.2em] border border-primary/20 px-8 py-3 hover:bg-primary/5 transition-colors">
                      CREATE_FIRST_TRANSMISSION
                   </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

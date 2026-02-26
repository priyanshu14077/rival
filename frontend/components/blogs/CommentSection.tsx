"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Comment } from "@/types";
import { format } from "date-fns";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import StarBorder from "@/components/StarBorder";

interface CommentSectionProps {
  blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const { status } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      const response = await api.get(`/blogs/${blogId}/comments`);
      return response as unknown as { items: Comment[], meta: any };
    },
  });

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      await api.post(`/blogs/${blogId}/comments`, { content: text });
    },
    onSuccess: () => {
      setContent("");
      toast.success("TRANSMISSION_COMPLETE: Comment logged");
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
    },
    onError: () => {
      toast.error("TRANSMISSION_FAILURE: Content rejected");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      mutation.mutate(content);
    }
  };

  return (
    <div className="mt-20 pt-20 border-t border-white/10 max-w-4xl mx-auto px-6">
      <header className="mb-12">
        <h2 className="text-3xl font-heading font-bold tracking-tighter text-white">COMM_LOGS</h2>
        <div className="h-px w-24 bg-primary/50 mt-2" />
      </header>

      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="mb-16">
          <div className="relative group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Inject commentary here..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 p-6 font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted/30"
            />
            <div className="absolute bottom-4 right-4">
              <button 
                type="submit" 
                disabled={mutation.isPending || !content.trim()}
                className="disabled:opacity-50"
              >
                <StarBorder
                  as="div"
                  color="cyan"
                  speed="4s"
                  className="px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {mutation.isPending ? "INJECTING..." : "SEND_DATA"}
                </StarBorder>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-16 p-8 border border-dashed border-white/10 bg-white/[0.01] text-center">
           <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
             [AUTHENTICATION_REQUIRED_FOR_COMM_INJECTION]
           </p>
        </div>
      )}

      <div className="space-y-8">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-4 w-32 bg-white/5" />
              <div className="h-16 w-full bg-white/5" />
            </div>
          ))
        ) : (
          comments?.items?.map((comment) => (
            <div key={comment.id} className="group relative">
               <div className="flex items-center gap-3 mb-3">
                 <span className="text-[10px] font-mono text-primary uppercase">
                   {comment.user?.name || "ANON_UNIT"}
                 </span>
                 <div className="h-[2px] w-4 bg-white/10" />
                 <span className="text-[10px] font-mono text-muted-foreground" suppressHydrationWarning>
                   {format(new Date(comment.createdAt), "HH:mm_yyyy.MM.dd")}
                 </span>
               </div>
               <div className="pl-4 border-l border-white/10 transition-colors group-hover:border-primary/30">
                 <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                   {comment.content}
                 </p>
               </div>
            </div>
          ))
        )}

        {!isLoading && (!comments?.items || comments?.items?.length === 0) && (
           <div className="text-center py-10">
             <p className="font-mono text-xs text-muted-foreground italic">NO_COMM_DATA_STREAMS_FOUND</p>
           </div>
        )}
      </div>
    </div>
  );
}

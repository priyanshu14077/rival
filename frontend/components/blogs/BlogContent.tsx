"use client";

import { Blog } from "@/types";
import { format } from "date-fns";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface BlogContentProps {
  blog: Blog;
}

export function BlogContent({ blog }: BlogContentProps) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-20">
      <header className="mb-12">
        {/* Cover Image */}
        {(blog.coverImage || true) && (
          <div className="relative w-full aspect-[21/9] mb-12 group overflow-hidden border border-white/5">
            <img 
              src={blog.coverImage?.startsWith('http') ? blog.coverImage : `https://images.unsplash.com/${blog.coverImage || 'photo-1451187580459-43490279c0fa'}?q=80&w=1200&auto=format`} 
              alt={blog.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-40 group-hover:opacity-20 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
               <div className="px-3 py-1 bg-primary text-black font-mono text-[10px] font-bold uppercase tracking-widest skew-x-[-12deg]">
                  STREAM_ACTIVE
               </div>
               <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] animate-pulse">
                  BROADCAST_NODE_{blog.id.substring(0, 4)}
               </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">
            TRANS_ID: {blog.id.substring(0, 8)}
          </span>
          <div className="h-px w-12 bg-white/10" />
          <span className="text-xs font-mono text-muted-foreground" suppressHydrationWarning>
            {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-white mb-8 border-l-4 border-primary pl-6 py-2">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary border border-primary/30">
            {blog.user?.name?.[0] || "A"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-muted-foreground uppercase">TRANSMITTED_BY</span>
            <span className="text-sm font-bold text-foreground">{blog.user?.name || "ANONYMOUS_UNIT"}</span>
          </div>
        </div>
      </header>

      {blog.summary && (
        <div className="mb-12 p-6 border-y border-white/5 bg-white/[0.02] font-mono text-sm italic text-muted-foreground leading-relaxed">
          <span className="text-primary not-italic mr-2">&gt; ABSTRACT:</span>
          {blog.summary}
        </div>
      )}

      <div className="prose prose-invert prose-cyan max-w-none">
        <div className="font-sans text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {blog.content}
        </div>
      </div>

      <div className="mt-16 py-8 border-y border-white/5 flex items-center justify-between">
         <LikeButton 
           blogId={blog.id} 
           initialLikes={blog.likesCount || 0} 
           initialHasLiked={blog.hasLiked || false} 
         />
         <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">STREAMS</span>
            <span className="text-sm font-bold font-mono text-foreground">
              {blog.commentsCount || 0} CMT
            </span>
         </div>
      </div>

      <CommentSection blogId={blog.id} />

      <footer className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">METADATA</span>
          <div className="flex gap-4">
             <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary rounded-full">
               SLUG: {blog.slug}
             </span>
             <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-muted-foreground rounded-full">
               HASH: {(blog.content.length * 31).toString(16)}
             </span>
          </div>
        </div>
      </footer>
    </article>
  );
}

import { useState } from "react";
import Link from "next/link";
import { Blog } from "@/types";
import StarBorder from "@/components/StarBorder";
import { format } from "date-fns";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  // Unsplash fallback logic: uses ID if available, otherwise a structured random one based on ID hash
  const imageId = blog.coverImage || `photo-1542831371-29b0f74f9713`; // Default tech image
  const imageUrl = blog.coverImage?.startsWith('http') 
    ? blog.coverImage 
    : `https://images.unsplash.com/${imageId}?q=80&w=800&auto=format`;

  return (
    <Link 
      href={`/blogs/${blog.slug}`} 
      onClick={(e) => {
        if (isNavigating) e.preventDefault();
        setIsNavigating(true);
      }}
      className={`block group ${isNavigating ? 'pointer-events-none opacity-80' : ''}`}
    >
      <StarBorder
        as="div"
        color="rgba(34, 211, 238, 0.2)"
        speed="8s"
        className="h-full transition-all duration-300 group-hover:bg-zinc-900/50 group-hover:border-primary/30"
      >
        <div className="p-6 flex flex-col h-full bg-background/40 backdrop-blur-sm">
          {/* Cover Image */}
          <div className="relative aspect-video mb-6 overflow-hidden bg-zinc-900 border border-white/5">
            <img 
              src={imageUrl} 
              alt={blog.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
          </div>

          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70" suppressHydrationWarning>
              {format(new Date(blog.createdAt), "yyyy.MM.dd")}
            </span>
            <div className="flex gap-4">
               {blog.likesCount !== undefined && (
                 <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                   LKS: {blog.likesCount}
                 </span>
               )}
               {blog.commentsCount !== undefined && (
                 <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                   CMT: {blog.commentsCount}
                 </span>
               )}
            </div>
          </div>

          <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>

          <p className="text-sm font-mono text-muted-foreground line-clamp-3 mb-6 flex-grow">
            {blog.summary || blog.content.substring(0, 150) + "..."}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              AUTH: {blog.user?.name || "ANON"}
            </span>
            <span className="text-primary text-xs font-mono group-hover:translate-x-1 transition-transform">
              {isNavigating ? "LOADING..." : "EXECUTE_READ >"}
            </span>
          </div>
        </div>
      </StarBorder>
    </Link>
  );
}

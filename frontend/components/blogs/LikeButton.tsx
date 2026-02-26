"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface LikeButtonProps {
  blogId: string;
  initialLikes: number;
  initialHasLiked: boolean;
}

export function LikeButton({ blogId, initialLikes, initialHasLiked }: LikeButtonProps) {
  const { status } = useAuthStore();
  const queryClient = useQueryClient();
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const mutation = useMutation({
    mutationFn: async () => {
      if (hasLiked) {
        await api.delete(`/blogs/${blogId}/like`);
      } else {
        await api.post(`/blogs/${blogId}/like`);
      }
    },
    onMutate: async () => {
      // Optimistic update
      const prevHasLiked = hasLiked;
      const prevLikesCount = likesCount;
      
      setHasLiked(!prevHasLiked);
      setLikesCount(prevHasLiked ? prevLikesCount - 1 : prevLikesCount + 1);

      return { prevHasLiked, prevLikesCount };
    },
    onError: (err, variables, context) => {
      if (context) {
        setHasLiked(context.prevHasLiked);
        setLikesCount(context.prevLikesCount);
      }
      toast.error("INTERACTION_SYNC_FAILURE");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "feed"] });
    },
  });

  const handleLike = () => {
    if (status !== "authenticated") {
      toast.error("AUTHENTICATION_REQUIRED: Access denied");
      return;
    }
    mutation.mutate();
  };

  return (
    <button
      onClick={handleLike}
      disabled={mutation.isPending}
      className="flex items-center gap-2 group transition-all duration-300"
    >
      <div className={cn(
        "p-3 rounded-full border transition-all duration-500",
        hasLiked 
          ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
          : "bg-white/5 border-white/10 text-muted-foreground group-hover:bg-white/10 group-hover:border-white/20"
      )}>
        <Heart className={cn("w-5 h-5", hasLiked && "fill-current")} />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">HEART_RATE</span>
        <span className={cn(
          "text-sm font-bold font-mono transition-colors",
          hasLiked ? "text-primary" : "text-foreground"
        )}>
          {likesCount} LKS
        </span>
      </div>
    </button>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Blog } from "@/types";
import { BlogContent } from "@/components/blogs/BlogContent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { use } from "react";

export default function BlogDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const slug = params.slug;

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      console.log(`[RIVAL] FETCHING_NODE: /public/blogs/${slug}`);
      const response = await api.get(`/public/blogs/${slug}`);
      console.log(`[RIVAL] NODE_RECEIVED:`, response);
      return response as unknown as Blog;
    },
    enabled: !!slug,
    retry: 1,
  });

  if (error) {
    toast.error("DATA_RETRIEVAL_FAILURE: Stream inaccessible");
    router.push("/feed");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-32 px-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8 animate-pulse">
           <div className="h-4 w-48 bg-white/5" />
           <div className="h-20 w-3/4 bg-white/5" />
           <div className="h-10 w-32 bg-white/5" />
           <div className="h-96 w-full bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {data && <BlogContent blog={data} />}
    </main>
  );
}

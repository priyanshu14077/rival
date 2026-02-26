"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StarBorder from "@/components/StarBorder";

const createBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  isPublished: z.boolean().optional(),
});

type CreateBlogValues = z.infer<typeof createBlogSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBlogValues>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      isPublished: true,
    },
  });

  const isPublished = watch("isPublished");

  const mutation = useMutation({
    mutationFn: async (data: CreateBlogValues) => {
      return await api.post("/blogs", data);
    },
    onSuccess: () => {
      toast.success("TRANSMISSION_INITIALIZED: Sequence complete");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "TRANSMISSION_FAILURE");
    },
  });

  const onSubmit = (data: CreateBlogValues) => {
    mutation.mutate(data);
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-heading font-black tracking-tighter text-white mb-2">
            INIT_TRANSMISSION
          </h1>
          <p className="font-mono text-muted-foreground text-sm uppercase tracking-widest italic">
            Defining data nodes for system broadcast...
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Title_Designation</label>
            <input
              {...register("title")}
              placeholder="THE_FUTURE_OF_REACTIVE_SYSTEMS"
              className="w-full bg-input/20 border border-white/10 px-6 py-4 rounded-none focus:outline-none focus:border-primary transition-colors font-heading text-xl font-bold placeholder:text-muted/30"
            />
            {errors.title && <p className="text-destructive text-xs font-mono uppercase italic">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Content_Data_Stream</label>
            <textarea
              {...register("content")}
              placeholder="Enter the transmission payload here..."
              rows={12}
              className="w-full bg-input/20 border border-white/10 px-6 py-4 rounded-none focus:outline-none focus:border-primary transition-colors font-mono text-sm leading-relaxed placeholder:text-muted/30 resize-none"
            />
            {errors.content && <p className="text-destructive text-xs font-mono uppercase italic">{errors.content.message}</p>}
          </div>

          <div className="flex items-center justify-between p-6 border border-white/5 bg-zinc-900/20">
             <div className="flex flex-col gap-1">
                <label className="text-xs font-mono uppercase tracking-widest text-white">Broadcast_Status</label>
                <p className="text-[10px] font-mono text-muted-foreground uppercase italic">Set to LIVE for public availability</p>
             </div>
             <button
               type="button"
               onClick={() => setValue("isPublished", !isPublished)}
               className={`w-16 h-8 flex items-center px-1 transition-colors duration-300 ${isPublished ? "bg-primary" : "bg-zinc-700"}`}
             >
               <div className={`w-6 h-6 bg-white transition-transform duration-300 ${isPublished ? "translate-x-8" : "translate-x-0"}`} />
             </button>
             <input type="hidden" {...register("isPublished")} />
          </div>

          <div className="flex gap-6 pt-4">
             <button
               type="submit"
               disabled={mutation.isPending}
               className="flex-1 relative group"
             >
               <StarBorder as="div" color="cyan" speed="5s" className="py-4">
                  <span className="font-heading font-bold tracking-widest uppercase">
                    {mutation.isPending ? "INITIALIZING..." : "EXECUTE_BROADCAST"}
                  </span>
               </StarBorder>
             </button>
             
             <button
               type="button"
               onClick={() => router.back()}
               className="px-10 py-4 font-mono text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-muted-foreground"
             >
               ABORT_SEQUENCE
             </button>
          </div>
        </form>
      </div>
    </main>
  );
}

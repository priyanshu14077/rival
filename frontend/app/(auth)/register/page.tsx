"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import StarBorder from "@/components/StarBorder";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const response = await api.post("/auth/register", data);
      return response as { user: any; token: string };
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Registration successful");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register");
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-3xl font-heading font-bold tracking-tighter mix-blend-difference text-white">NEW ENTITY</h1>
        <p className="text-muted-foreground text-sm font-mono">Register new access credentials</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Designation</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Nomad"
            className="w-full bg-input/50 border border-border px-4 py-3 rounded-none focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-muted/50"
          />
          {errors.name && <p className="text-destructive text-xs font-mono">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Identifier</label>
          <input
            {...register("email")}
            type="email"
            placeholder="system@rival.net"
            className="w-full bg-input/50 border border-border px-4 py-3 rounded-none focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-muted/50"
          />
          {errors.email && <p className="text-destructive text-xs font-mono">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
           <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Access Key</label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full bg-input/50 border border-border px-4 py-3 rounded-none focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-muted/50"
          />
          {errors.password && <p className="text-destructive text-xs font-mono">{errors.password.message}</p>}
        </div>

        <div className="pt-4">
           {/* Custom Wrapper over React-Bits StarBorder to act as submit button */}
           <button type="submit" disabled={mutation.isPending} className="w-full relative group">
              <StarBorder 
                as="div" 
                color="cyan" 
                speed="6s" 
                className={`w-full py-4 uppercase font-heading tracking-widest text-sm font-bold bg-background text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {mutation.isPending ? "GENERATING..." : "CREATE ENTITY"}
              </StarBorder>
           </button>
        </div>
      </form>

      <div className="text-center text-sm font-mono text-muted-foreground mt-4">
        Already registered?{" "}
        <Link href="/login" className="text-primary hover:underline underline-offset-4 font-bold">
          Access Portal
        </Link>
      </div>
    </div>
  );
}

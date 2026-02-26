"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const { token, status } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // In a real app, you might also want to verify token expiration here
      if (!token && status !== "loading") {
        router.replace("/login");
      } else {
        setIsChecking(false);
      }
    }, [token, status, router]);

    if (isChecking) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-primary tracking-widest text-sm uppercase">Verifying Access...</p>
        </div>
      );
    }

    if (!token) return null;

    return <WrappedComponent {...props} />;
  };
}

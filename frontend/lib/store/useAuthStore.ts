import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    token: string | null;
    status: "idle" | "loading" | "authenticated" | "unauthenticated";

    // Actions
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    setUser: (user: User) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            status: "idle",

            setAuth: (user, token) => set({ user, token, status: "authenticated" }),

            clearAuth: () => set({ user: null, token: null, status: "unauthenticated" }),

            setUser: (user) => set({ user }),

            setLoading: (isLoading) => set({ status: isLoading ? "loading" : "idle" }),
        }),
        {
            name: "rival-auth-storage",
            partialize: (state) => ({ token: state.token, user: state.user }),
        }
    )
);

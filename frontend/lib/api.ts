import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";
import { toast } from "sonner";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const isNetworkError = !error.response;

        if (isNetworkError) {
            toast.error("Network error. Please check your connection.");
            return Promise.reject(new Error("Network Error"));
        }

        const { status, data } = error.response;

        if (status === 401) {
            useAuthStore.getState().clearAuth();
            toast.error("Session expired. Please log in again.");
            if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
                window.location.href = "/login";
            }
        }

        const message = data?.message || "An unexpected error occurred.";
        return Promise.reject(new Error(message));
    }
);

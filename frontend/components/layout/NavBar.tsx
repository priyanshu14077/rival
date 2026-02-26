"use client";

import PillNav from "../PillNav";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function NavBar() {
  const { status, clearAuth } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearAuth();
    router.push("/login");
  };

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const commonItems = [
    { label: "Home", href: "/" },
    { label: "Feed", href: "/feed" },
  ];

  const authItems = status === "authenticated"
    ? [
        ...commonItems,
        { label: "Dashboard", href: "/dashboard" },
        { label: "Sign Out", href: "#", onClick: handleLogout },
      ]
    : [
        ...commonItems,
        { label: "Log In", href: "/login" },
        { label: "Register", href: "/register" },
      ];

  const themeToggleItem = {
    label: theme === "dark" ? "Light Mode" : "Dark Mode",
    href: "#",
    onClick: toggleTheme,
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <PillNav
        logo=""
        logoAlt="R"
        items={[
          { href: "/" }, // Logo link placeholder
          ...authItems,
          themeToggleItem,
        ]}
        className="shadow-2xl shadow-cyan-500/10 border border-white/10"
        baseColor="var(--foreground)"
        pillColor="var(--primary)"
      />
    </div>
  );
}

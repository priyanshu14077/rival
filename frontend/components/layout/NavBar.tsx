"use client";

import type React from "react";
import PillNav from "../PillNav";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useTheme } from "next-themes";
import { UserMenu } from "./UserMenu";
import { useEffect, useState } from "react";

export function NavBar() {
  const { status } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Feed", href: "/feed" },
    ...(status !== "authenticated"
      ? [
          { label: "Log In", href: "/login" },
          { label: "Register", href: "/register" },
        ]
      : []),
    {
      label: mounted ? (theme === "dark" ? "Light" : "Dark") : "Theme",
      href: "#",
      onClick: toggleTheme,
    },
  ];

  return (
    <div className="fixed top-6 w-full flex justify-center items-center px-6 z-50 pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto bg-black/50 backdrop-blur-md rounded-full px-2 py-1 border border-white/5 shadow-2xl">
        <PillNav
          logo=""
          logoAlt="R"
          items={navItems}
          className="bg-transparent border-none shadow-none"
          baseColor="var(--foreground)"
          pillColor="var(--primary)"
          pillTextColor="var(--background)"
          onMobileMenuClick={() => {}}
        />
        
        {status === "authenticated" && (
          <div className="h-6 w-px bg-white/10 mx-2" />
        )}
        
        {status === "authenticated" && <UserMenu />}
      </div>
    </div>
  );
}

"use client";

import { useAuthStore } from "@/zustand/auth-store";
import MobileMenu from "./mobile-menu";
import PCMenu from "./pc-menu";
import { useEffect } from "react";

export default function Header() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);


  return (
    <header className="fixed bg-background z-20 top-0 left-0 right-0 h-24 border-b border-yellow-400">
      <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row">
        <MobileMenu />
        <PCMenu />
      </div>
    </header>
  );
}

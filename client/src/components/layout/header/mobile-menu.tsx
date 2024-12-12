"use client";

import Button from "@/components/ui/button";
import Logo from "./logo";
import Navbar from "./navbar";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";

export default function MobileMenu() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="lg:hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-14">
        <Button 
          onClick={handleAuthAction}
          className="flex items-center justify-center rounded-full py-0 h-6"
        >
          <span className="text-xs">
            {isAuthenticated ? "로그아웃" : "로그인"}
          </span>
        </Button>
        <Logo />
        <div className="w-[58px]" />
      </div>
      <div className="flex-1 flex items-end">
        <Navbar />
      </div>
    </div>
  );
}

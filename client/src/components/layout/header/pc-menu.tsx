"use client";

import Button from "@/components/ui/button";
import Logo from "./logo";
import Navbar from "./navbar";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";

export default function PCMenu() {
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
    <div className="hidden lg:flex w-full h-24 items-center justify-between px-4">
      <Logo />
      <div className="h-full flex justify-center">
        <Navbar />
      </div>
      <Button 
        onClick={handleAuthAction}
        className="flex items-center justify-center rounded-full w-24"
      >
        <span>{isAuthenticated ? "로그아웃" : "로그인"}</span>
      </Button>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";
import { LogInResponse } from "@/types/api";
import { useRouter } from "next/navigation";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleLogin = async (data: { username: string; password: string }) => {
    console.log("login test");
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const result: LogInResponse = await res.json();
      login(result);
      router.push("/");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}

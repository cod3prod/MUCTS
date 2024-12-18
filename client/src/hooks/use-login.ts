"use client";

import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";
import { LogInResponse } from "@/types/api";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthStore();

  const handleLogin = async (data: { username: string; password: string }) => {
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
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error };
}

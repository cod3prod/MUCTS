"use client";

import { RefreshTokenResponse } from "@/types/api";
import { useAuthStore } from "@/zustand/auth-store";
import { useState, useCallback } from "react";

export function useFetch<T>() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTokens, initialize } = useAuthStore();

  const fetchWithRetry = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, options);

        if (response.ok) {
          const responseData = await response.json();
          return responseData;
        }

        if (response.status === 401) {
          const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-tokens`,
            {
              method: options?.method || "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
              },
            }
          );

          if (!refreshResponse.ok) {
            localStorage.clear();
            initialize();
            throw new Error("Failed to refresh token");
          }

          const refreshData: RefreshTokenResponse = await refreshResponse.json();

          localStorage.setItem("accessToken", refreshData.accessToken);
          localStorage.setItem("refreshToken", refreshData.refreshToken);
          setTokens(refreshData.accessToken, refreshData.refreshToken);

          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          const retryData = await retryResponse.json();
          return retryData;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      } catch (err) {
        setError((err as Error).message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setTokens, initialize]
  );

  return { fetchWithRetry, isLoading, error };
}

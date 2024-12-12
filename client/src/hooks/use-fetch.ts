import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";

type FetchProps = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  options?: RequestInit;
};

export default function useFetch<T>({url, method, body, options}: FetchProps) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { accessToken, refreshToken, login, logout } = useAuthStore();

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-tokens`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('토큰 갱신 실패');
      }

      const tokens = await response.json();
      await login(tokens);
      return tokens.accessToken;
    } catch (error) {
      logout();
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (response.status === 401) {
        // 토큰이 만료된 경우
        const newAccessToken = await refreshAccessToken();
        // 새로운 토큰으로 다시 요청
        const retryResponse = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
            ...options?.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          ...options,
        });

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => null);
          throw new Error(
            errorData?.description || 
            `HTTP 에러! 상태: ${retryResponse.status}`
          );
        }

        const responseData = await retryResponse.json();
        setData(responseData);
        return responseData;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.description || 
          `HTTP 에러! 상태: ${response.status}`
        );
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
}
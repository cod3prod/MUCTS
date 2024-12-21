"use client";

import ProfileHeader from "./profile-header";
import ProfileInfo from "./profile-info";
import { useAuthStore } from "@/zustand/auth-store";
import { useFetch } from "@/hooks/use-fetch";
import { UsersControllerResponse } from "@/types/api";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import RequireLogin from "@/components/ui/require-login";

export default function ProfileCard() {
  const [data, setData] = useState<UsersControllerResponse | null>(null);
  const { accessToken, isAuthenticated, user } = useAuthStore();
  const { fetchWithRetry, isLoading, error } = useFetch<UsersControllerResponse | null>();
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = `${BASE_URL}/users/me`;

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const fetchData = async () => {
      const result = await fetchWithRetry(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (result) setData(result);
    };

    fetchData();
  }, [isAuthenticated, accessToken, user]);

  if (!isAuthenticated) return <RequireLogin />;

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={() => router.replace("/login")}
            className="mt-4 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            다시 로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ProfileHeader />
        <ProfileInfo data={data}/>
      </div>
    </div>
  );
}

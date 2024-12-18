"use client";

import Button from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";
import { useFetch } from "@/hooks/use-fetch";
import { UsersControllerResponse } from "@/types/api";
import Modal from "../modal";
import { useRouter } from "next/navigation";

export default function MyChatButton() {
  const [showAlert, setShowAlert] = useState(false);
  const [isChatIdEmpty, setIsChatIdEmpty] = useState(false);
  const { fetchWithRetry, isLoading } = useFetch<UsersControllerResponse>();
  const { accessToken, isAuthenticated } = useAuthStore();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = `${BASE_URL}/users/me`;
  const router = useRouter();

  const handleClick = async () => {
    if (!isAuthenticated) {
      setShowAlert(true);
      return;
    }

    const response = await fetchWithRetry(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response?.user?.chatId) {
      setShowAlert(true);
      setIsChatIdEmpty(true);
      return;
    }

    router.push(`/chat/${response.user.chatId}`);
  };

  return (
    <>
      <button
        disabled={isLoading}
        onClick={handleClick}
        className="flex items-center justify-center flex-1 h-10 lg:h-full text-sm lg:text-xl text-gray-500 hover:text-black font-medium border-b-2 border-transparent hover:border-primary"
      >
        {isLoading ? "기다려주세요" : "내 채팅"}
      </button>
      <Modal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="알림"
      >
        <div className="p-4 text-center">
          {!isAuthenticated && <p>로그인이 필요합니다.</p>}
          {isAuthenticated && isChatIdEmpty && <p>채팅을 찾을 수 없습니다.</p>}
          <Button
            onClick={() => setShowAlert(false)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
}
